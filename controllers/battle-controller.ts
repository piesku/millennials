import {element} from "../lib/random.js";
import {delay} from "../lib/timeout.js";

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
                await delay(1000);
            }
        }

        *StartBattle() {
            const hand = this.querySelector("a-hand")!;
            const cards = [
                "forrest-gump",
                "robin-hood",
                "marty-mcfly",
                "super-man",
                "obi-wan-kenobi",
                "harry-potter",
                "bat-man",
                "ne-o",
                "luke-skywalker",
                "robo-cop",
                "tmnt-leonardo",
                "tmnt-michaelangelo",
                "tmnt-donatello",
                "tmnt-raphael",
            ];
            for (let i = 0; i < 3; i++) {
                hand.appendChild(document.createElement(element(cards)));
            }

            const table = this.querySelector("a-table")!;
            const locations = ["death-star", "arkham-asylum", "future-hill-valley"];
            for (let i = 0; i < locations.length; i++) {
                table.appendChild(document.createElement(locations[i]));
            }

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

        *DrawCard() {
            // Draw a card
        }

        *PlayCard() {
            // Play a card
        }
    },
);
