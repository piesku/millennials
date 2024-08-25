import {ActorController} from "../actors/ActorController.js";
import {CardController} from "../cards/CardController.js";
import {fragment, html} from "../lib/html.js";
import {clamp} from "../lib/number.js";
import {element, set_seed} from "../lib/random.js";
import {delay} from "../lib/timeout.js";
import {LocationController} from "../locations/LocationController.js";
import {Message} from "../messages.js";
import {ActorElement} from "./a-actor.js";
import {CardElement} from "./a-card.js";
import {LocationElement} from "./a-location.js";
import {GameContainer} from "./game-container.js";

const INTERVAL = 1;

const Log = (message: string) => {
    const logDisplay = document.querySelector("a-log") as HTMLElement;
    if (logDisplay) {
        if (message.startsWith("---") && message.endsWith("---")) {
            message = `<h3>${message.slice(3, -3).trim()}</h3>`;
        }
        logDisplay.innerHTML += `<div>${message}</div>`;
        logDisplay.scrollTop = logDisplay.scrollHeight;
    }
};

export class BattleScene extends HTMLElement {
    CurrentTurn = 0;
    MaxTurns = 6;
    State: "playing" | "won" | "lost" = "playing";

    PlayedCardsQueue: Array<CardController> = [];

    constructor() {
        set_seed(Math.random());

        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                }

                main {
                    box-sizing: border-box;
                    height: 100vh;
                    overflow-y: auto;
                }

                .grid {
                    display: grid;
                    grid-template-columns: repeat(6, min-content);
                    gap: 20px;
                    padding: 20px;
                    border-radius: 5px;
                }

                ::slotted(a-actor) {
                    flex: 1;
                }

                ::slotted(a-log) {
                    display: flex;
                    flex-direction: column;
                    width: 300px;
                    height: calc(100vh - 100px);
                    overflow-y: auto;
                    background-color: rgba(255, 255, 255, 0.8);
                    padding: 10px;
                    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
                    flex: 1;
                    padding-bottom: 100px;
                }

                button {
                    margin: 10px;
                    width: 100px;
                }
            </style>
        `;
    }

    connectedCallback() {
        this.addEventListener("drop", (e) => {
            const data = e.dataTransfer!.getData("text/plain");
            const card = document.getElementById(data) as CardElement;
            if (card) {
                const energy_left = card.Instance.Owner.CurrentEnergy;
                const card_cost = card.Instance.CurrentCost;
                if (card_cost > energy_left) {
                    return false;
                }

                card.Instance.Owner.CurrentEnergy -= card.Instance.CurrentCost;
                card.Instance.Owner.Element.ReRender();

                this.PlayedCardsQueue.push(card.Instance);
                let location = card.closest<LocationElement>("a-location")!.Instance;
                console.log(`you play ${card.Instance.Name} to ${location.Name}`);
            }
        });

        this.shadowRoot!.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            if (target.id === "end") {
                switch (this.State) {
                    case "playing":
                        this.RunEndTurn();
                        break;
                    case "won":
                        let game = this.closest("game-container") as GameContainer;
                        game.ProgressToNextOpponent();
                        break;
                    case "lost":
                        break;
                }
            }
        });
    }

    PrepareBattle() {
        let villain_element = this.querySelector<ActorElement>("a-actor:not([type=player])");
        if (!villain_element && DEBUG) {
            throw "BattleScene must have a villain";
        }
        let villain = villain_element!.Instance;

        let location_elements = this.querySelectorAll<LocationElement>("a-location");
        if (location_elements.length === 0 && DEBUG) {
            throw "BattleScene must have locations";
        }
        let locations: Array<LocationController> = [];
        for (let location of location_elements) {
            locations.push(location.Instance);
        }

        const sprite_height = 16;
        const sprite_padding = 1;
        const target_size = 240;
        const scale = target_size / sprite_height;
        const sprite_y = (sprite_height + sprite_padding) * villain.Sprite * scale;

        const img_src = document.querySelector("body > img[hidden]")?.getAttribute("src");
        const background_url = `url(${img_src})`;

        let main = fragment(html`
            <main style="padding:20px;">
                <h1>Prepare For the Next Battle</h1>
                <flex-row gap start>
                    <div>
                        <h2>Shop (Pick 1)</h2>
                        <div class="grid" style="background:darksalmon;">
                            <slot name="shop"></slot>
                        </div>
                        <h2>Your Deck</h2>
                        <div class="grid" style="background:darkseagreen;">
                            <slot name="deck"></slot>
                        </div>
                    </div>
                    <div style="width:280px">
                        <h2>Next Up</h2>
                        <div style="padding:20px; background:lightblue; border-radius:5px;">
                            <h3 style="margin-top:0;">${villain.Name}</h3>
                            <div
                                style="
                                width: ${target_size}px;
                                height: ${target_size}px;
                                background-image: ${background_url};
                                background-position: 0 -${sprite_y}px;
                                background-size: ${target_size}px auto;
                                image-rendering: pixelated;
                                margin: 0 auto;
                                border: 1px solid black;
                                border-radius: 5px;
                            "
                            ></div>
                            <p><i>${villain.Description}</i></p>
                            ${locations.map(
                                (location) => html`
                                    <h4>${location.Name}</h4>
                                    <p>${location.Description}</p>
                                `,
                            )}
                        </div>
                    </div>
                </flex-row>
            </main>
        `);
        this.shadowRoot!.append(main);

        let all_cards: Array<CardElement> = [];
        for (let card_type in CardElement.Controllers) {
            let card = document.createElement("a-card") as CardElement;
            card.setAttribute("type", card_type);
            card.setAttribute("slot", "shop");
            card.setAttribute("draggable", "true");
            card.classList.add("frontside");

            card.addEventListener("dragstart", (e) => {
                let card = e.target as CardElement;
                if (e.dataTransfer) {
                    e.dataTransfer.setData("text/plain", card.id);
                }
            });

            all_cards.push(card);
        }

        let game = this.closest("game-container") as GameContainer;

        let player_cards: Array<CardElement> = [];
        for (let card_type of game.PlayerDeck) {
            let card = document.createElement("a-card") as CardElement;
            card.setAttribute("type", card_type.toString());
            card.setAttribute("slot", "deck");
            card.classList.add("frontside");

            card.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            card.addEventListener("drop", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer) {
                    const data = e.dataTransfer.getData("text/plain");
                    const new_card = document.getElementById(data) as CardElement;
                    if (new_card) {
                        // Update the deck view.
                        let offset = player_cards.indexOf(card);
                        player_cards.splice(offset, 1, new_card);
                        //deck.replaceChildren(...player_cards);

                        // Update the deck data.
                        game.PlayerDeck = player_cards.map((card) => card.Instance.Sprite);

                        // Start the battle.
                        this.InitBattle();
                    }
                }
            });

            player_cards.push(card);
        }

        let all_cards_by_cost = Object.groupBy(all_cards, (card) => clamp(1, 6, card.Instance.Cost));
        this.append(element(all_cards_by_cost[1]!));
        this.append(element(all_cards_by_cost[2]!));
        this.append(element(all_cards_by_cost[3]!));
        this.append(element(all_cards_by_cost[4]!));
        this.append(element(all_cards_by_cost[5]!));
        this.append(element(all_cards_by_cost[6]!));

        player_cards.sort(CardElement.Compare);
        this.append(...player_cards);
    }

    async InitBattle() {
        let main = fragment(html`
            <flex-row>
                <flex-col style="flex: 4;">
                    <slot name="villain"></slot>
                    <flex-col style="flex: 1; justify-content: center;">
                        <slot name="location"></slot>
                    </flex-col>
                    <flex-row>
                        <slot name="player"></slot>
                        <button id="end">End Turn</button>
                    </flex-row>
                </flex-col>
                <slot name="log"></slot>
            </flex-row>
        `);
        this.shadowRoot!.append(main);

        window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: "smooth",
        });

        for (let message of this.StartBattle()) {
            Log(message);
            await delay(INTERVAL);
        }
    }

    *StartBattle() {
        yield "--- Lights… camera… action! ---";

        const player = this.querySelector("a-actor[type=player]") as ActorElement;
        yield* player.Instance.StartBattle();

        const villain = this.querySelector("a-actor:not([type=player])") as ActorElement;
        yield* villain.Instance.StartBattle();

        yield* this.BroadcastGameMessage(Message.BattleStarts);
        yield* this.StartTurn();
    }

    *StartTurn() {
        this.CurrentTurn++;

        yield `--- Start Turn ${this.CurrentTurn} ---`;

        const player = this.querySelector("a-actor[type=player]") as ActorElement;
        yield* player.Instance.StartTurn(this.CurrentTurn);

        const villain = this.querySelector("a-actor:not([type=player])") as ActorElement;
        yield* villain.Instance.StartTurn(this.CurrentTurn);

        yield* this.BroadcastGameMessage(Message.TurnStarts);

        yield* villain.Instance.RivalAI();
    }

    async RunEndTurn() {
        for (let message of this.EndTurn()) {
            Log(message);
            await delay(INTERVAL);
        }
    }

    *EndTurn() {
        yield "--- End Turn ---";

        for (let card of this.querySelectorAll<CardElement>("a-table a-card")) {
            if (!card.Instance.IsRevealed) {
                card.classList.remove("frontside");
            }
        }

        let unrevealed_cards = this.PlayedCardsQueue.filter((card) => !card.IsRevealed);
        for (let card of unrevealed_cards) {
            yield* card.Reveal();
            yield* this.BroadcastCardMessage(Message.CardEntersTable, card);
        }

        yield* this.BroadcastGameMessage(Message.TurnEnds);

        if (this.CurrentTurn >= this.MaxTurns) {
            yield* this.GameEnd();
        } else {
            yield* this.StartTurn();
        }
    }

    *GameEnd() {
        yield "--- Game Over ---";
        yield* this.BroadcastGameMessage(Message.BattleEnds);

        // TODO Calculate the winner.

        this.State = "won";
        this.shadowRoot!.querySelector("#end")!.textContent = "You Win";
    }

    *BroadcastGameMessage(kind: Message) {
        let locations = [...this.querySelectorAll<LocationElement>("a-location")].map((location) => location.Instance);
        for (let location of locations) {
            yield* location.OnMessage(kind);

            for (let card of location.GetRevealedCards()) {
                yield* card.OnMessage(kind);
            }
        }
    }

    *BroadcastCardMessage(kind: Message, card: CardController) {
        // First, broadcast the message to the card's location.
        yield* card.Location.OnMessage(kind, card);

        // Then, broadcast the message to other revealed cards in the same location.
        for (let other of card.Location.GetRevealedCards()) {
            if (other !== card) {
                yield* other.OnMessage(kind, card);
            }
        }

        // Finally, broadcast the message to other locations and their revealed cards.
        let locations = [...this.querySelectorAll<LocationElement>("a-location")]
            .map((location) => location.Instance)
            .filter((location) => location !== card.Location);
        for (let location of locations) {
            yield* location.OnMessage(kind, card);

            for (let other of location.GetRevealedCards()) {
                yield* other.OnMessage(kind, card);
            }
        }
    }

    GetRevealedCards(actor?: ActorController) {
        let locations = [...this.querySelectorAll<LocationElement>("a-location")].map((location) => location.Instance);
        return locations.flatMap((location) => location.GetRevealedCards(actor));
    }
}

customElements.define("battle-scene", BattleScene);
