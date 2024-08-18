import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {html} from "../lib/html.js";
import {set_seed} from "../lib/random.js";
import {delay} from "../lib/timeout.js";
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

        yield* this.StartTurn();
    }

    *StartTurn() {
        this.CurrentTurn++;

        yield `--- Start Turn ${this.CurrentTurn} ---`;

        const player = this.querySelector("#player")! as ActorController;
        yield* player.StartTurn(this.CurrentTurn);

        const rival = this.querySelector("#rival")! as ActorController;
        yield* rival.StartTurn(this.CurrentTurn);

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
        }

        yield* this.StartTurn();
    }
}

customElements.define("battle-controller", BattleController);
