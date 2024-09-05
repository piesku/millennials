import {ActorController} from "../actors/ActorController.js";
import {CardController} from "../cards/CardController.js";
import {color_from_seed} from "../lib/color.js";
import {html} from "../lib/html.js";
import {set_seed} from "../lib/random.js";
import {delay} from "../lib/timeout.js";
import {LocationController} from "../locations/LocationController.js";
import {Message, Trace} from "../messages.js";
import {CollectionFlag, save_card_state} from "../storage.js";
import {ActorElement} from "./a-actor.js";
import {CardElement} from "./a-card.js";
import {LocationElement} from "./a-location.js";
import {GameContainer} from "./game-container.js";
import {LocationSlot} from "./location-slot.js";

const INTERVAL = 100;

export class BattleScene extends HTMLElement {
    CurrentTurn = 0;
    MaxTurns = 6;
    State: "prep" | "playing" | "won" | "lost" = "prep";

    PlayedCardsQueue: Array<CardController> = [];

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    get Game() {
        let game = this.closest<GameContainer>("game-container");
        DEBUG: if (!game) {
            throw "BattleScene must be a child of GameContainer";
        }
        return game;
    }

    get Player() {
        let player_element = this.querySelector<ActorElement>("a-actor[type=player]");
        if (!player_element && DEBUG) {
            throw "BattleScene must have a player";
        }
        return player_element!.Instance;
    }

    get Villain() {
        let villain_element = this.querySelector<ActorElement>("a-actor:not([type=player])");
        DEBUG: if (!villain_element) {
            throw "BattleScene must have a villain";
        }
        return villain_element.Instance;
    }

    get Locations() {
        return Array.from(this.querySelectorAll<LocationElement>("a-location"), (location) => location.Instance);
    }

    Render() {
        let location_elements = this.querySelectorAll<LocationElement>("a-location");
        if (location_elements.length === 0 && DEBUG) {
            throw "BattleScene must have locations";
        }
        let locations: Array<LocationController> = [];
        for (let location of location_elements) {
            locations.push(location.Instance);
        }

        const sprite_height = 10;
        const target_height = 240;
        const pixel_size = target_height / sprite_height;
        const sprite_y = (sprite_height + 1) * this.Villain.Sprite * pixel_size;

        const spritesheet_src = document.querySelector("img#sheet")?.getAttribute("src");
        const background_url = `url(${spritesheet_src})`;

        const mask_src = document.querySelector("img#mask")?.getAttribute("src");
        const mask_url = `url(${mask_src})`;

        let current_view = this.State === "prep" ? "prep" : "playing";
        let button_text = this.State === "playing" ? "Reveal" : this.State === "won" ? "Next!" : "Play Again";

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
                    display: block;
                    resize: horizontal;
                    box-sizing: border-box;
                    width: 40vw;
                    height: 100vh;
                    overflow-y: auto;
                    background-color: rgba(255, 255, 255, 0.8);
                    padding: 10px 10px 100px;
                    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
                }

                button {
                    margin: 10px;
                    width: 100px;
                }

                .sprite-border {
                    position: relative;
                    height: ${target_height}px;
                    background: ${color_from_seed(this.Villain.Name)};
                    overflow: hidden;
                }

                .sprite {
                    width: ${target_height / 2}px;
                    height: ${target_height}px;
                    margin: 0 ${pixel_size * 2}px 0 ${pixel_size * 3}px;
                    background-image: ${background_url};
                    background-position: 0 -${sprite_y}px;
                    background-size: ${target_height / 2}px auto;
                    image-rendering: pixelated;
                }

                .mask {
                    position: absolute;
                    inset: 0;
                    background-image: ${mask_url};
                    background-size: ${target_height}px auto;
                    image-rendering: pixelated;
                }
            </style>
            <multi-view current="${current_view}">
                <main name="prep" style="padding:20px;">
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
                                <h3 style="margin-top:0;">${this.Villain.Name}</h3>
                                <div class="sprite-border">
                                    <div class="sprite"></div>
                                    <div class="mask"></div>
                                </div>
                                <p><i>${this.Villain.Description}</i></p>
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
                <main name="playing">
                    <flex-row>
                        <flex-col style="flex: 1;">
                            <flex-row>
                                <slot name="villain"></slot>
                            </flex-row>
                            <flex-col style="flex: 1; justify-content: center;">
                                <slot name="location"></slot>
                            </flex-col>
                            <flex-row>
                                <slot name="player"></slot>
                                <flex-col>
                                    <button id="end" style="flex:1">${button_text}</button>
                                    <button id="undo">Undo</button>
                                </flex-col>
                            </flex-row>
                        </flex-col>
                        <slot name="log"></slot>
                    </flex-row>
                </main>
            </multi-view>
        `;
    }

    connectedCallback() {
        this.Render();

        this.addEventListener("drop", (e) => {
            const data = e.dataTransfer!.getData("text/plain");
            const card = document.getElementById(data) as CardElement;
            if (card) {
                const energy_left = card.Instance.Owner.CurrentEnergy;
                const card_cost = card.Instance.CurrentCost;
                if (card_cost > energy_left) {
                    return false;
                }

                let location = card.closest<LocationElement>("a-location");
                if (location) {
                    card.Instance.Owner.CurrentEnergy -= card.Instance.CurrentCost;
                    card.Instance.Owner.Element.Render();

                    this.PlayedCardsQueue.push(card.Instance);
                    this.Log(new Trace(), `You play ${card.Instance} to ${location.Instance}`);
                }
            }
        });

        this.shadowRoot!.addEventListener("click", (e) => {
            let game = this.closest("game-container") as GameContainer;
            let target = e.target as HTMLElement;
            if (target.id === "end") {
                switch (this.State) {
                    case "playing":
                        this.RunEndTurn();
                        break;
                    case "won":
                        game.ProgressToNextOpponent();
                        break;
                    case "lost":
                        console.table(game.Stats);
                        game.Reset();
                        break;
                }
            } else if (target.id === "undo") {
                let card = this.PlayedCardsQueue.pop();
                if (card && card.Owner === this.Player && !card.IsRevealed) {
                    card.Owner.CurrentEnergy += card.CurrentCost;
                    card.Owner.Element.Render();

                    // TODO This reorders the cards in the hand.
                    this.Player.Hand.append(card.Element);

                    let log_element = this.querySelector("a-log");
                    log_element?.lastElementChild?.remove();
                }
            }
        });
    }

    PrepareBattle() {
        set_seed(this.Game.Seed * (this.Game.CurrentOpponent + 1));

        for (let card of this.querySelectorAll<CardElement>("a-card")) {
            card.addEventListener("dragstart", (e) => {
                let card = e.target as CardElement;
                if (e.dataTransfer) {
                    e.dataTransfer.setData("text/plain", card.id);
                }
            });

            // Update the collection state for the cards in the shop.
            save_card_state(card.Instance, CollectionFlag.Seen);
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
                        let offset = game.PlayerDeck.indexOf(new_card.Instance.Sprite);
                        game.PlayerDeck.splice(offset, 1, new_card.Instance.Sprite);

                        // Update the collection state for the new card in deck.
                        save_card_state(new_card.Instance, CollectionFlag.Owned);
                        this.Game.Stats.CardsAcquired++;

                        // Start the battle.
                        this.InitBattle();
                    }
                }
            });

            player_cards.push(card);

            // Update the collection state for the cards in hand.
            save_card_state(card.Instance, CollectionFlag.Seen | CollectionFlag.Owned);
        }

        player_cards.sort(CardElement.Compare);
        this.append(...player_cards);
    }

    async InitBattle() {
        this.State = "playing";
        this.Render();

        this.Game.Stats.Battles++;

        for (let [trace, message] of this.StartBattle()) {
            this.Log(trace, message);
            for (let location of this.Locations) {
                location.Element.Render();
            }
            await delay(INTERVAL);
        }
    }

    *StartBattle() {
        let trace = new Trace();

        yield trace.log("--- Lights… camera… action! ---");

        const villain = this.querySelector("a-actor:not([type=player])") as ActorElement;
        yield* villain.Instance.StartBattle(trace.fork());

        const player = this.querySelector("a-actor[type=player]") as ActorElement;
        yield* player.Instance.StartBattle(trace.fork());

        yield* this.BroadcastGameMessage(Message.BattleStarts);
        yield* this.StartTurn();
    }

    *StartTurn() {
        let trace = new Trace();

        this.CurrentTurn++;

        yield trace.log(`--- Turn ${this.CurrentTurn} ---`);

        if (this.CurrentTurn < 4) {
            let location = this.Locations[this.CurrentTurn - 1];
            yield* location.Reveal(trace.fork());
        }

        yield* this.Player.StartTurn(this.CurrentTurn, trace.fork());
        yield* this.Villain.StartTurn(this.CurrentTurn, trace.fork());

        yield* this.BroadcastGameMessage(Message.TurnStarts);

        yield* this.Villain.VillAIn(trace.fork());
    }

    async RunEndTurn() {
        for (let [trace, message] of this.EndTurn()) {
            this.Log(trace, message);
            for (let location of this.Locations) {
                location.Element.Render();
            }
            await delay(INTERVAL);
        }
    }

    *EndTurn() {
        let trace = new Trace();

        yield trace.log("--- Revealing Cards ---");

        for (let card of this.querySelectorAll<CardElement>("a-table a-card")) {
            if (!card.Instance.IsRevealed) {
                card.classList.remove("frontside");
            }
        }

        let unrevealed_cards = this.PlayedCardsQueue.filter((card) => !card.IsRevealed);
        for (let card of unrevealed_cards) {
            yield* this.BroadcastCardMessage(Message.CardLeavesHand, new Trace(), card);
            yield* card.Reveal(new Trace());

            if (card.Owner === this.Player) {
                this.Game.Stats.CardsPlayed++;
                this.Game.Stats.EnergySpent += card.CurrentCost;
            }
        }

        yield* this.BroadcastGameMessage(Message.TurnEnds);

        if (this.CurrentTurn >= this.MaxTurns) {
            yield* this.EndBattle();
        } else {
            yield* this.StartTurn();
        }
    }

    *EndBattle() {
        let trace = new Trace();

        yield trace.log("--- The Reviews Are In ---");

        let locations_won = 0;
        for (let location of this.Locations) {
            let score = location.GetScore(this.Player);
            if (score >= location.GetScore(this.Villain)) {
                locations_won++;
                location.Element.classList.add("won");
                yield trace.log(`You win ${location}`);
            } else {
                location.Element.classList.add("lost");
                yield trace.log(`You lose ${location}`);
            }

            this.Game.Stats.TotalPower += score;
        }

        this.Game.Stats.LocationsWon += locations_won;
        this.Game.Stats.LocationsLost += this.Locations.length - locations_won;

        if (locations_won >= this.Locations.length / 2) {
            this.State = "won";
        } else {
            this.State = "lost";
        }

        this.Render();
        yield* this.BroadcastGameMessage(Message.BattleEnds);
    }

    *BroadcastGameMessage(kind: Message) {
        if (DEBUG) {
            console.log("%c" + Message[kind], "color: orange");
        }

        let trace = new Trace();

        for (let location of this.Locations) {
            if (location.IsRevealed) {
                yield* location.OnMessage(kind, trace.fork(location));
            }

            for (let card of location.GetRevealedCards()) {
                yield* card.OnMessage(kind, trace.fork(card));
            }
        }
    }

    *BroadcastCardMessage(kind: Message, trace: Trace, card: CardController) {
        DEBUG: console.log(
            Message[kind],
            card.Name,
            trace.map((value) => (typeof value === "number" ? value : value.Name)),
        );

        // First, broadcast the message to the card itself.
        yield* card.OnMessageSelf(kind, trace.fork(card));

        if (card.Location) {
            // Then, broadcast the message to the card's location, if it's revealed.
            if (card.Location.IsRevealed && !trace.includes(card.Location)) {
                yield* card.Location.OnMessage(kind, trace.fork(card.Location), card);
            }

            // Then, broadcast the message to other revealed cards in the same location.
            for (let other of card.Location.GetRevealedCards()) {
                if (other.Element !== card.Element && !trace.includes(other)) {
                    yield* other.OnMessage(kind, trace.fork(other), card);
                }
            }

            // Finally, broadcast the message to other locations and their revealed cards.
            let locations = this.Locations.filter((location) => location !== card.Location);
            for (let location of locations) {
                if (location.IsRevealed && !trace.includes(location)) {
                    yield* location.OnMessage(kind, trace.fork(location), card);
                }

                for (let other of location.GetRevealedCards()) {
                    if (!trace.includes(other)) {
                        yield* other.OnMessage(kind, trace.fork(other), card);
                    }
                }
            }
        }
    }

    GetRevealedCards(actor?: ActorController) {
        return [...this.querySelectorAll<LocationElement>("a-location")].flatMap((location) =>
            location.Instance.GetRevealedCards(actor),
        );
    }

    GetEmptySlots(actor: ActorController) {
        return this.querySelectorAll<LocationSlot>(
            `location-owner[slot=${actor.Type}] location-slot:not(:has(a-card))`,
        );
    }

    CleanUp(card: CardController) {
        let modifiers = this.querySelectorAll(`a-modifier[origin-id="${card.Id}"]`);
        for (let modifier of modifiers) {
            modifier.remove();
        }
    }

    Log(trace: Trace, message: string) {
        const logDisplay = this.querySelector("a-log") as HTMLElement;
        if (logDisplay) {
            let tabs = trace.map((item) => (typeof item === "number" ? item : 1)).reduce((a, b) => a + b, 0);
            let indent = new Array(tabs).fill("…").join(" ");
            console.log(`%c${indent} ${message}`, "color: green", trace);

            if (message.startsWith("---") && message.endsWith("---")) {
                message = `<h3>${message.slice(3, -3).trim()}</h3>`;
            }
            logDisplay.innerHTML += `<div>${indent} ${message}</div>`;
            logDisplay.scrollTo({
                top: logDisplay.scrollHeight,
                behavior: "smooth",
            });
        }
    }
}

customElements.define("battle-scene", BattleScene);
