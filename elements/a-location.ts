import {html} from "../lib/html.js";
import {Location} from "../locations/Location.js";

customElements.define(
    "a-location",
    class extends HTMLElement {
        playerPoints: number = 0;
        enemyPoints: number = 0;

        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            const name = this.getAttribute("name") ?? "";
            const description = this.getAttribute("description") ?? "";

            this.shadowRoot!.innerHTML = html`
                <style>
                    .location {
                        border: 1px solid #000;
                        padding: 10px;
                        margin: 10px;
                        background-color: #246b24;
                    }
                    .description {
                        margin: 10px 0;
                    }
                    slot[name^="player"]::slotted(*) {
                        border: 1px dashed #000;
                        width: 45%;
                    }
                    .points {
                        margin: 5px;
                    }
                    .name-description {
                        text-align: center;
                        margin: 0 10px;
                    }
                </style>
                <flex-row class="location">
                    <slot name="player1"></slot>
                    <div id="player-points" class="points">${this.playerPoints}</div>
                    <div class="name-description">
                        <div class="name">${name}</div>
                        <div class="description">
                            <slot name="description">${description}</slot>
                        </div>
                    </div>
                    <div id="enemy-points" class="points">${this.enemyPoints}</div>
                    <slot name="player2"></slot>
                </flex-row>
            `;

            this.innerHTML = `
                <location-owner slot="player1">
                    <location-slot label=1></location-slot>
                    <location-slot label=2></location-slot>
                    <location-slot label=3></location-slot>
                    <location-slot label=4></location-slot>
                </location-owner>

                <location-owner slot="player2" reverse>
                    <location-slot label=1></location-slot>
                    <location-slot label=2></location-slot>
                    <location-slot label=3></location-slot>
                    <location-slot label=4></location-slot>
                </location-owner>
            `;
        }

        get Location(): Location {
            return this.parentElement as Location;
        }

        updatePoints(side: "player" | "enemy", points: number) {
            if (side === "player") {
                this.playerPoints += points;
                this.shadowRoot!.getElementById("player-points")!.textContent = this.playerPoints.toString();
            } else {
                this.enemyPoints += points;
                this.shadowRoot!.getElementById("enemy-points")!.textContent = this.enemyPoints.toString();
            }
        }
    },
);
