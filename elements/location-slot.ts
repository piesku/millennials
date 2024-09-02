import {html} from "../lib/html.js";
import {CardElement} from "./a-card.js";

export class LocationSlot extends HTMLElement {
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
                    border: 4px ridge orange;
                    border-radius: 5px;
                    width: 60px;
                    height: 90px;
                }

                slot::slotted(*) {
                    transform: scale(0.5) translate(-50%, -50%);
                }
            </style>
            <slot></slot>
        `;

        this.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        this.addEventListener("drop", (e) => {
            e.preventDefault();
            if (this.firstElementChild) {
                alert("Slot is already occupied");
                e.stopPropagation();
                return;
            }
            const data = e.dataTransfer!.getData("text/plain");
            const card = document.getElementById(data) as CardElement;
            if (card) {
                this.appendChild(card);
                card.classList.add("frontside");
            }
        });
    }
}

customElements.define("location-slot", LocationSlot);
