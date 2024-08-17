import {CardElement} from "../elements/a-card.js";
import {html} from "../lib/html.js";
import {element, set_seed} from "../lib/random.js";
import {delay} from "../lib/timeout.js";
import {ActorController} from "./actor-controller.js";

export class BattleController extends HTMLElement {
    CurrentTurn = 0;

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

        const player1 = this.querySelector("#p1")! as ActorController;
        yield* player1.SetupBattle();

        const enemies = [
            {type: "darth-vader", count: 0},
            {type: "storm-trooper", count: 0},
        ];

        for (let i = 0; i < enemies.length; i++) {
            for (let j = 0; j < enemies[i].count; j++) {
                const randomLocation = element(locations);
                const locationElement = this.querySelector(randomLocation)!;
                const enemyDropZone = locationElement
                    .shadowRoot!.querySelector("a-location")!
                    .shadowRoot!.querySelector("#enemy-drop-area")!;
                enemyDropZone.appendChild(document.createElement(enemies[i].type));
            }
        }
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
        for (let card of this.querySelectorAll<CardElement>("a-table a-card")) {
            if (!card.Controller.IsRevealed) {
                card.classList.remove("frontside");
            }
        }

        // TODO Just for testing.
        for (let card of this.querySelectorAll<CardElement>("a-table a-card")) {
            yield* card.Controller.Reveal();
        }
    }
}

customElements.define("battle-controller", BattleController);
