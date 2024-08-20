import {html} from "../lib/html.js";
import {CardController} from "./CardController.js";

export abstract class ActorController extends HTMLElement {
    abstract Name: string;
    MaxEnergy = 0;
    CurrentEnergy = 0;

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <style>
                ::slotted(a-avatar),
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

    // TODO How to do this better?
    ReRender() {
        let avatar = this.querySelector("a-avatar")!;
        avatar.setAttribute("current-energy", this.CurrentEnergy.toString());
        avatar.setAttribute("max-energy", this.MaxEnergy.toString());
    }

    abstract StartBattle(): Generator<string, void>;

    *StartTurn(turn: number) {
        yield* this.DrawCard();

        this.CurrentEnergy = this.MaxEnergy = turn;
        this.ReRender();
    }

    *DrawCard() {
        const hand = this.querySelector("a-hand")!;
        const deck = this.querySelector("a-deck")!;

        if (deck.firstElementChild) {
            let card = deck.firstElementChild as CardController;
            yield `${this.id} draws ${card.Name}`;
            hand.appendChild(card);
        } else {
            yield "but the deck is empty";
        }
    }

    *RivalAI(): Generator<string, void> {}
}
