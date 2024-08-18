import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {html} from "../lib/html.js";
import {set_seed} from "../lib/random.js";
import {delay} from "../lib/timeout.js";
import {Message} from "../messages.js";
import {ActorController} from "./ActorController.js";
import {CardController} from "./CardController.js";

export class BattleController extends HTMLElement {
    CurrentTurn = 0;
    PlayedCardsQueue: Array<CardController> = [];

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        set_seed(Math.random());
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                    height: 100vh;
                }
                ::slotted(a-table) {
                    flex: 1;
                    align-items: center;
                }
            </style>
            <flex-col>
                <slot></slot>
            </flex-col>
        `;

        this.InitBattle();

        this.addEventListener("drop", (e) => {
            const data = e.dataTransfer!.getData("text/plain");
            const card = document.getElementById(data) as CardController;
            if (card) {
                this.PlayedCardsQueue.push(card);
                let location = card.closest<LocationElement>("a-location")!.Controller;
                console.log(`you play ${card.Name} to ${location.Name}`);
            }
        });

        this.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            if (target.id === "end-turn") {
                this.RunEndTurn();
            }
        });
    }

    async InitBattle() {
        for (let message of this.StartBattle()) {
            console.log(message);
            await delay(250);
        }
    }

    *StartBattle() {
        const table = this.querySelector("a-table")!;
        const locations = ["death-star", "arkham-asylum", "future-hill-valley"];
        for (let i = 0; i < locations.length; i++) {
            table.appendChild(document.createElement(locations[i]));
        }

        yield "--- Lights… camera… action! ---";

        const player = this.querySelector("#player")! as ActorController;
        yield* player.StartBattle();

        const rival = this.querySelector("#rival")! as ActorController;
        yield* rival.StartBattle();

        yield* this.BroadcastGameMessage(Message.BattleStarts);
        yield* this.StartTurn();
    }

    *StartTurn() {
        this.CurrentTurn++;

        yield `--- Start Turn ${this.CurrentTurn} ---`;

        const player = this.querySelector("#player")! as ActorController;
        yield* player.StartTurn(this.CurrentTurn);

        const rival = this.querySelector("#rival")! as ActorController;
        yield* rival.StartTurn(this.CurrentTurn);

        yield* this.BroadcastGameMessage(Message.TurnStarts);

        yield* rival.RivalAI();
    }

    async RunEndTurn() {
        for (let message of this.EndTurn()) {
            console.log(message);
            await delay(250);
        }
    }

    *EndTurn() {
        yield "--- End Turn ---";

        for (let card of this.querySelectorAll<CardElement>("a-table a-card")) {
            if (!card.Controller.IsRevealed) {
                card.classList.remove("frontside");
            }
        }

        let unrevealed_cards = this.PlayedCardsQueue.filter((card) => !card.IsRevealed);
        for (let card of unrevealed_cards) {
            yield* card.Reveal();
            yield* this.BroadcastCardMessage(Message.CardEntersTable, card);
        }

        yield* this.BroadcastGameMessage(Message.TurnEnds);
        yield* this.StartTurn();
    }

    *BroadcastGameMessage(kind: Message) {
        let locations = [...this.querySelectorAll<LocationElement>("a-location")].map(
            (location) => location.Controller,
        );
        for (let location of locations) {
            yield* location.OnMessage(kind);

            for (let other of location.GetRevealedCards()) {
                yield* other.OnMessage(kind);
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
            .map((location) => location.Controller)
            .filter((location) => location !== card.Location);
        for (let location of locations) {
            yield* location.OnMessage(kind, card);

            for (let other of location.GetRevealedCards()) {
                yield* other.OnMessage(kind, card);
            }
        }
    }

    GetRevealedCards(actor?: string) {
        let locations = [...this.querySelectorAll<LocationElement>("a-location")].map(
            (location) => location.Controller,
        );
        return locations.flatMap((location) => location.GetRevealedCards(actor));
    }
}

customElements.define("battle-controller", BattleController);
