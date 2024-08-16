import {element} from "../lib/random.js";
import {delay} from "../lib/timeout.js";
import {ActorController} from "./actor-controller.js";

customElements.define(
    "battle-controller",
    class extends HTMLElement {
        CurrentTurn = 0;

        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            this.shadowRoot!.innerHTML = `
                <style>
                    :host {
                        display: block;
                        height: 100vh;
                    }
                </style>
                <flex-col>
                    <slot></slot>
                </flex-col>
            `;

            this.InitBattle();
        }

        async InitBattle() {
            for (let _ of this.StartBattle()) {
                console.log("tick");
                await delay(450);
            }
        }

        *StartBattle() {
            const table = this.querySelector("a-table")!;
            const locations = ["death-star", "arkham-asylum", "future-hill-valley"];
            for (let i = 0; i < locations.length; i++) {
                table.appendChild(document.createElement(locations[i]));
            }

            const player1 = this.querySelector("actor-controller[who=player1]")! as ActorController;
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

        *EndTurn() {
            // End the turn
        }

        *PlayCard() {
            // Play a card
        }
    },
);
