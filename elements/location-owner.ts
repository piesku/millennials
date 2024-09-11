import {html} from "../lib/html.js";
import {CardElement} from "./a-card.js";
import {LocationElement} from "./a-location.js";

export class LocationOwner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    get Location() {
        let location = this.closest<LocationElement>("a-location");
        DEBUG: if (!location) {
            throw "Location side must be in a location";
        }
        return location.Instance;
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    width: 278px;
                    height: 90px;
                    border: 4px ridge orange;
                    border-radius: 5px;
                    padding: 10px;
                }
            </style>
            <flex-row wrap start style="gap:10px;">
                <slot></slot>
            </flex-row>
        `;

        if (this.slot === "player") {
            this.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            this.addEventListener("drop", (e) => {
                e.preventDefault();
                if (this.childElementCount >= 4) {
                    alert("Location is full");
                    e.stopPropagation();
                    return;
                }
                const data = e.dataTransfer!.getData("text/plain");
                const card = document.getElementById(data) as CardElement;
                if (card) {
                    if (this.Location.CanBePlayedHere(card.Instance) && card.Instance.CanBePlayedHere(this.Location)) {
                        this.append(card);
                        card.classList.add("frontside");
                    } else {
                        alert("Can't be played here!");
                        e.stopPropagation();
                    }
                }
            });
        }
    }
}
customElements.define("location-owner", LocationOwner);
