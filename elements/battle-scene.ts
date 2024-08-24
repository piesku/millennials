import {ActorController} from "../actors/ActorController.js";
import {CardController} from "../cards/CardController.js";
import {html} from "../lib/html.js";
import {set_seed} from "../lib/random.js";
import {delay} from "../lib/timeout.js";
import {Message} from "../messages.js";
import {ActorElement} from "./a-actor.js";
import {CardElement} from "./a-card.js";
import {LocationElement} from "./a-location.js";
import {GameContainer} from "./game-container.js";

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
        super();
        this.attachShadow({mode: "open"});
        set_seed(Math.random());
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <style>
                ::slotted(a-table) {
                    flex: 1;
                    align-items: center;
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
            <flex-row>
                <flex-col style="flex: 4;">
                    <slot name="villain"></slot>
                    <slot name="table"></slot>
                    <flex-row>
                        <slot name="player"></slot>
                        <button id="end">End Turn</button>
                    </flex-row>
                </flex-col>
                <slot name="log"></slot>
            </flex-row>
        `;

        this.InitBattle();

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

    async InitBattle() {
        for (let message of this.StartBattle()) {
            Log(message);
            await delay(250);
        }
    }

    *StartBattle() {
        const table = this.querySelector("a-table")!;
        const locations = ["death-star", "arkham-asylum", "future-hill-valley"];
        for (let i = 0; i < locations.length; i++) {
            let location = document.createElement("a-location");
            location.setAttribute("type", locations[i]);
            table.appendChild(location);
        }

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
            await delay(250);
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
