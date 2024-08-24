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
            card.setAttribute("draggable", "true");
            card.classList.add("frontside");

            card.addEventListener("dragstart", (e) => {
                let card = e.target as CardElement;
                if (e.dataTransfer) {
                    e.dataTransfer.setData("text/plain", card.id);
                }
            });

            all_cards.push(card);
        }

        let all_cards_by_cost = Object.groupBy(all_cards, (card) => clamp(1, 6, card.Instance.Cost));

        let game = this.closest("game-container") as GameContainer;

        let player_cards: Array<CardElement> = [];
        for (let card_type of game.PlayerDeck) {
            let card = document.createElement("a-card") as CardElement;
            card.setAttribute("type", card_type.toString());
            card.classList.add("frontside");

            card.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            card.addEventListener("drop", (e) => {
                e.preventDefault();
                if (e.dataTransfer) {
                    const data = e.dataTransfer.getData("text/plain");
                    const new_card = document.getElementById(data) as CardElement;
                    if (new_card) {
                        // Update the deck view.
                        let offset = player_cards.indexOf(card);
                        player_cards.splice(offset, 1, new_card);
                        deck.replaceChildren(...player_cards);

                        // Update the deck data.
                        game.PlayerDeck = player_cards.map((card) => card.Instance.Sprite);

                        // Go to the next battle.
                        history.pushState("battle", "", "#battle");
                        game.setAttribute("view", "battle");
                    }
                }
            });

            player_cards.push(card);
        }

        player_cards.sort(CardElement.Compare);

        let villain = game.OrderedOpponents[game.CurrentOpponent];

        const sprite_height = 16;
        const sprite_padding = 1;
        const target_size = 240;
        const scale = target_size / sprite_height;
        const sprite_y = (sprite_height + sprite_padding) * villain.Actor.Instance.Sprite * scale;

        const img_src = document.querySelector("body > img[hidden]")?.getAttribute("src");
        const background_url = `url(${img_src})`;

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
                .sprite {
                    width: ${target_size}px;
                    height: ${target_size}px;
                    background-image: ${background_url};
                    background-position: 0 -${sprite_y}px;
                    background-size: ${target_size}px auto;
                    image-rendering: pixelated;
                    margin: 0 auto;
                    border: 1px solid black;
                    border-radius: 5px;
                }
            </style>
            <h1>Prepare For the Next Battle</h1>
            <flex-row gap start>
                <div>
                    <h2>Shop (Pick 1)</h2>
                    <div style="padding:20px; background:darksalmon; border-radius:5px;">
                        <slot name="shop"></slot>
                    </div>
                    <h2>Your Deck</h2>
                    <div style="padding:20px; background:darkseagreen; border-radius:5px;">
                        <slot name="deck"></slot>
                    </div>
                </div>
                <div style="width:280px">
                    <h2>Next Up</h2>
                    <div style="padding:20px; background:lightblue; border-radius:5px;">
                        <h3 style="margin-top:0;">${villain.Actor.Instance.Name}</h3>
                        <div class="sprite"></div>
                        <p><i>${villain.Actor.Instance.Description}</i></p>
                        ${villain.Locations.map(
                            (location) => html`
                                <h4>${location.Instance.Name}</h4>
                                <p>${location.Instance.Description}</p>
                            `,
                        )}
                    </div>
                </div>
            </flex-row>
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
