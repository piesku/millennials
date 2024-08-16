import {Card} from "../cards/Card.js";
import {html} from "../lib/html.js";

customElements.define(
    "location-slot",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            const label = this.getAttribute("label") ?? "?";
            this.shadowRoot!.innerHTML = html`
                <style>
                    :host {
                        display: grid;
                        place-items: center;
                        border: 1px solid #000;
                        width: 60px;
                        height: 90px;
                    }
                </style>
                <slot>${label}</slot>
            `;

            this.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            this.addEventListener("drop", (e) => {
                e.preventDefault();
                if (this.firstElementChild) {
                    alert("Slot is already occupied");
                    return;
                }
                const data = e.dataTransfer!.getData("text/plain");
                const card = document.getElementById(data) as Card;
                if (card) {
                    this.appendChild(card);
                }
            });
        }
    },
);
