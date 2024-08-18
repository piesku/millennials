import {CardElement} from "../elements/a-card.js";
import {html} from "../lib/html.js";
import {set_seed} from "../lib/random.js";
import {delay} from "../lib/timeout.js";
import {ActorController} from "./actor-controller.js";
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

        this.addEventListener("card-dropped", (e) => {
            let ce = e as CustomEvent;
            this.PlayedCardsQueue.push(ce.detail);
        });

        this.addEventListener("end-turn-clicked", (e) => {
            this.RunEndTurn();
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

        const player = this.querySelector("#player")! as ActorController;
        yield* player.SetupBattle();

        const rival = this.querySelector("#rival")! as ActorController;
        yield* rival.SetupBattle();
    }

    *StartTurn() {
        // Start the turn
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
    }
}

customElements.define("battle-controller", BattleController);
