import {html} from "../lib/html.js";
import {CardElement} from "./a-card.js";

export class CollectionViewer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        let all_cards: Array<CardElement> = [];
        for (let card_type in CardElement.Controllers) {
            let card = document.createElement("a-card") as CardElement;
            card.setAttribute("type", card_type);
            card.classList.add("frontside");
            all_cards.push(card);
        }

        all_cards.sort(CardElement.Compare);

        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                    padding: 20px;
                }
            </style>
            <h1>Card Collection (${all_cards.length})</h1>
            <flex-row wrap start style="gap: 20px;">
                <slot></slot>
            </flex-row>
        `;

        this.append(...all_cards);
    }
}

customElements.define("collection-viewer", CollectionViewer);
