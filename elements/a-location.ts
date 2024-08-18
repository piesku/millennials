import {LocationController} from "../controllers/LocationController.js";
import {html} from "../lib/html.js";

export class LocationElement extends HTMLElement {
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
                    background-color: bisque;
                }
                .description {
                    margin: 10px 0;
                }
                ::slotted(location-owner) {
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
                <slot name="player"></slot>
                <div id="player-points" class="points">${0}</div>
                <div class="name-description">
                    <div class="name">${name}</div>
                    <div class="description">
                        <slot name="description">${description}</slot>
                    </div>
                </div>
                <div id="enemy-points" class="points">${0}</div>
                <slot name="rival"></slot>
            </flex-row>
        `;
    }

    get Controller(): LocationController {
        return this.parentElement as LocationController;
    }
}

customElements.define("a-location", LocationElement);
