import {html} from "../lib/html.js";
import {clamp} from "../lib/number.js";
import {CollectionFlag, get_collection_state} from "../storage.js";
import {CardElement} from "./a-card.js";

const GROUP_BY_COST = true;
export class CollectionViewer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        let collection = get_collection_state();
        let all_cards: Array<CardElement> = [];
        let cards_by_cost: {[cost: number]: Array<CardElement>} = {};

        let known_cards_count = 0;
        let owned_cards_count = 0;

        for (let card_type in CardElement.Controllers) {
            let card = document.createElement("a-card") as CardElement;
            card.setAttribute("type", card_type);
            card.classList.add("frontside");

            if (card.Instance.IsVillain || card.Instance.Text === "") {
                continue;
            }

            if (collection.cards[card.Instance.Name] & CollectionFlag.Seen) {
                known_cards_count++;
            } else {
                // card.classList.add("unknown");
            }

            if (collection.cards[card.Instance.Name] & CollectionFlag.Owned) {
                owned_cards_count++;
            } else {
                // card.classList.add("unowned");
            }

            all_cards.push(card);

            let cost = card.Instance.CurrentCost;
            if (!cards_by_cost[cost]) {
                cards_by_cost[cost] = [];
            }
            cards_by_cost[cost].push(card);
        }

        all_cards.sort(CardElement.Compare);

        let content;
        if (GROUP_BY_COST) {
            let cost_sections = Object.keys(cards_by_cost)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((cost) => {
                    let cards = cards_by_cost[cost as unknown as number];
                    return html`
                        <h2>${cost}-Cost (${cards.length})</h2>
                        <flex-row wrap start style="gap: 20px;">
                            ${cards.map((card) => card.outerHTML).join("")}
                        </flex-row>
                    `;
                })
                .join("");

            content = html`
                <h1>
                    Card Collection (total: ${all_cards.length}, seen: ${known_cards_count}, unlocked:
                    ${owned_cards_count})
                </h1>
                ${cost_sections}
            `;
        } else {
            content = html`
                <h1>
                    Card Collection (total: ${all_cards.length}, seen: ${known_cards_count}, unlocked:
                    ${owned_cards_count})
                </h1>
                <flex-row wrap start style="gap: 20px;"> ${all_cards.map((card) => card.outerHTML).join("")} </flex-row>
            `;
        }

        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                    padding: 20px;
                }
            </style>
            ${content}
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

customElements.define("collection-viewer", CollectionViewer);
