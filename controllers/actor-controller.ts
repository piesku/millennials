import {html} from "../lib/html.js";
import {element} from "../lib/random.js";

export class ActorController extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <style>
                ::slotted(a-deck) {
                    flex: 1;
                }
                ::slotted(a-hand) {
                    flex: 3;
                }
            </style>
            <flex-row>
                <slot></slot>
            </flex-row>
        `;
    }

    *SetupBattle() {
        const cards = [
            "a-baracus",
            "a-faceman",
            "a-hannibal",
            "a-murdock",
            "bat-man",
            "bla-de",
            "buzz-lightyear",
            "denver-dinosaur",
            "forrest-gump",
            "harry-potter",
            "hermi-one",
            "homer-simpson",
            "indiana-jones",
            "james-bond",
            "kre-cik",
            "luke-skywalker",
            "mac-gyver",
            "marty-mcfly",
            "mor-ty",
            "mufa-sa",
            "ne-o",
            "obi-wan-kenobi",
            "rick-sanchez",
            "robin-hood",
            "robo-cop",
            "ron-wesley",
            "sim-ba",
            "super-man",
            "tmnt-donatello",
            "tmnt-leonardo",
            "tmnt-michaelangelo",
            "tmnt-raphael",
            "woo-dy",
        ];

        const deck = this.querySelector("a-deck")!;
        for (let i = 0; i < 12; i++) {
            const card = element(cards);
            console.log({card});
            deck.appendChild(document.createElement(card));
        }

        for (let i = 0; i < 3; i++) {
            yield* this.DrawCard();
        }
    }

    *DrawCard() {
        const hand = this.querySelector("a-hand")!;
        const deck = this.querySelector("a-deck")!;

        if (deck.firstElementChild) {
            yield console.log("draws a card");
            hand.appendChild(deck.firstElementChild);
        } else {
            yield console.log("but the deck is empty");
        }
    }
}

customElements.define("actor-controller", ActorController);
