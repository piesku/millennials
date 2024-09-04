import {html} from "../lib/html.js";
import {CollectionFlag, get_collection_state} from "../storage.js";
import {CardElement} from "./a-card.js";

export class CollectionViewer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        let collection = get_collection_state();
        let all_cards: Array<CardElement> = [];

        let known_cards_count = 0;
        let owned_cards_count = 0;

        for (let card_type in CardElement.Controllers) {
            let card = document.createElement("a-card") as CardElement;
            card.setAttribute("type", card_type);
            card.classList.add("frontside");

            if (card.Instance.IsVillain) {
                continue;
            }

            if (collection.cards[card.Instance.Name] & CollectionFlag.Seen) {
                known_cards_count++;
            } else {
                card.classList.add("unknown");
            }

            if (collection.cards[card.Instance.Name] & CollectionFlag.Owned) {
                owned_cards_count++;
            } else {
                card.classList.add("unowned");
            }

            //if (card.Instance.Text) {
            all_cards.push(card);
            //}
        }

        all_cards.sort(CardElement.Compare);

        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                    padding: 20px;
                }
            </style>
            <h1>
                Card Collection (total: ${all_cards.length}, seen: ${known_cards_count}, unlocked: ${owned_cards_count})
            </h1>
            <flex-row wrap start style="gap: 20px;">
                <slot></slot>
            </flex-row>
        `;

        this.append(...all_cards);
    }
}

customElements.define("collection-viewer", CollectionViewer);
