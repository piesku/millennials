import {html} from "../lib/html.js";
import {CardElement} from "./a-card.js";

export class LocationOwner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
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
                if (!card.Instance.CanBePlayedHere(this)) {
                    alert("Can't be played here!");
                    e.stopPropagation();
                    return;
                } else {
                    this.appendChild(card);
                    card.classList.add("frontside");
                }
            }
        });
    }
}
customElements.define("location-owner", LocationOwner);
