import {html} from "../lib/html.js";
import {clamp} from "../lib/number.js";
import {element} from "../lib/random.js";
import {CardElement} from "./a-card.js";
import {GameContainer} from "./game-container.js";

export class BattlePrepare extends HTMLElement {
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

        let all_cards_by_cost = Object.groupBy(all_cards, (card) => clamp(1, 6, card.Instance.Cost));

        let game = this.closest("game-container") as GameContainer;

        let player_cards: Array<CardElement> = [];
        for (let card_type of game.PlayerDeck) {
            let card = document.createElement("a-card") as CardElement;
            card.setAttribute("type", card_type.toString());
            card.classList.add("frontside");
            player_cards.push(card);
        }

        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                    padding: 20px;
                }
                ::slotted([slot]) {
                    display: grid;
                    grid-template-columns: repeat(6, min-content);
                    gap: 20px;
                }
            </style>
            <h1>Prepare For the Next Battle</h1>
            <h2>Shop (Pick 1)</h2>
            <div style="padding:20px; background: burlywood;">
                <slot name="shop"></slot>
            </div>
            <h2>Your Deck</h2>
            <div style="padding:20px; background: darkseagreen;">
                <slot name="deck"></slot>
            </div>
        `;

        let shop = this.querySelector("[slot=shop]") as HTMLElement;
        shop.append(element(all_cards_by_cost[1]!));
        shop.append(element(all_cards_by_cost[2]!));
        shop.append(element(all_cards_by_cost[3]!));
        shop.append(element(all_cards_by_cost[4]!));
        shop.append(element(all_cards_by_cost[5]!));
        shop.append(element(all_cards_by_cost[6]!));

        let deck = this.querySelector("[slot=deck]") as HTMLElement;
        deck.append(...player_cards);
    }
}

customElements.define("battle-prepare", BattlePrepare);
