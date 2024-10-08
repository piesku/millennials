import {html} from "../lib/html.js";
import {clamp, format_percent} from "../lib/number.js";
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

            if (card.Controller.IsVillain) {
                continue;
            }

            if (collection.cards[card.Controller.Name] & CollectionFlag.Seen) {
                known_cards_count++;
            } else {
                card.classList.add("unknown");
            }

            if (collection.cards[card.Controller.Name] & CollectionFlag.Owned) {
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
                    grid-template-columns: repeat(auto-fill, 120px);
                    grid-auto-flow: dense;
                    padding: 20px;
                    gap: 20px;
                }
                ::slotted(button) {
                    flex: 1;
                    margin: 10px;
                }
                h1 {
                    height: 182px;
                    grid-area: 2/2/3/8;
                    font-size: 160px;
                    margin: 0;
                }
                h1,
                [center] {
                    font-style: italic;
                    font-weight: bold;
                    color: #f60;
                }
                div {
                    font-size: 100px;
                }
            </style>
            <main>
                ${all_cards.map((card) => card.outerHTML).join("")}
                <h1>Millennials</h1>
                <flex-col style="grid-row: 3; grid-column: 5 / span 2; ">
                    <slot></slot>
                </flex-col>
                <flex-col center style="grid-area:4/1;">
                    <div>${known_cards_count}</div>
                    ${format_percent(known_cards_count / all_cards.length)} seen
                </flex-col>
                <flex-col center style="grid-area:4/4;">
                    <div>${owned_cards_count}</div>
                    ${format_percent(owned_cards_count / all_cards.length)} unlocked
                </flex-col>
            </main>
        `;
    }

    get AllCards() {
        let card_elements = this.shadowRoot!.querySelectorAll<CardElement>("a-card");
        return Array.from(card_elements, (card) => card.Controller);
    }

    AllCardsByCost() {
        return Object.groupBy(this.AllCards, (card) => clamp(1, 6, card.Cost));
    }
}

customElements.define("collection-title", CollectionTitle);
