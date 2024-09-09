import {html} from "../lib/html.js";
import {clamp} from "../lib/number.js";
import {CollectionFlag, get_collection_state} from "../storage.js";
import {CardElement} from "./a-card.js";

export class CollectionTitle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.render();
    }

    render() {
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

            all_cards.push(card);
        }

        all_cards.sort(CardElement.Compare);

        this.shadowRoot!.innerHTML = html`
            <style>
                main {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, 122px);
                    grid-auto-flow: dense;
                    padding: 20px;
                    gap: 20px;
                }
                ::slotted(button) {
                    flex: 1;
                    margin: 10px;
                }
            </style>
            <main>
                ${all_cards.map((card) => card.outerHTML).join("")}
                <div style="grid-row: 2; grid-column: 2 / span 6;">
                    <h1 style="font-size:160px; color:#f60; margin:0;">
                        <i>Millennials</i>
                    </h1>
                </div>
                <flex-col style="grid-row: 3; grid-column: 5 / span 2; ">
                    <slot></slot>
                </flex-col>
                <div>total: ${all_cards.length}, seen: ${known_cards_count}, unlocked: ${owned_cards_count}</div>
            </main>
        `;
    }

    get AllCards() {
        let card_elements = this.shadowRoot!.querySelectorAll<CardElement>("a-card");
        return Array.from(card_elements, (card) => card.Instance);
    }

    AllCardsByCost() {
        return Object.groupBy(this.AllCards, (card) => clamp(1, 6, card.Cost));
    }
}

customElements.define("collection-title", CollectionTitle);
