import {element} from "../lib/random.js";

export class ActorController extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = `
            <flex-row>
                <slot></slot>
            </flex-row>
        `;
    }

    *SetupBattle() {
        const cards = [
            "forrest-gump",
            "robin-hood",
            "marty-mcfly",
            "super-man",
            "obi-wan-kenobi",
            "harry-potter",
            "bat-man",
            "ne-o",
            "luke-skywalker",
            "robo-cop",
            "tmnt-leonardo",
            "tmnt-michaelangelo",
            "tmnt-donatello",
            "tmnt-raphael",
        ];

        const deck = this.querySelector("a-deck")!;
        for (let i = 0; i < cards.length; i++) {
            deck.appendChild(document.createElement(element(cards)));
        }

        for (let i = 0; i < 3; i++) {
            yield* this.DrawCard();
        }
    }

    *DrawCard() {
        const hand = this.querySelector("a-hand")!;
        const deck = this.querySelector("a-deck")!;

        yield;

        if (deck.firstElementChild) {
            console.log("draws a card");
            hand.appendChild(deck.firstElementChild);
        } else {
            console.log("but the deck is empty");
        }
    }
}

customElements.define("actor-controller", ActorController);
