import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {LocationSlot} from "../elements/location-slot.js";
import {html} from "../lib/html.js";
import {element} from "../lib/random.js";
import {BattleController} from "./BattleController.js";

export class ActorController extends HTMLElement {
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

    *StartBattle() {
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
            deck.appendChild(document.createElement(card));
        }

        for (let i = 0; i < 3; i++) {
            yield* this.DrawCard();
        }
    }

    *StartTurn(turn: number) {
        yield* this.DrawCard();

        this.CurrentEnergy = this.MaxEnergy = turn;
        let avatar = this.querySelector("a-avatar")!;
        avatar.setAttribute("current-energy", this.CurrentEnergy.toString());
        avatar.setAttribute("max-energy", this.MaxEnergy.toString());
    }

    *DrawCard() {
        const hand = this.querySelector("a-hand")!;
        const deck = this.querySelector("a-deck")!;

        if (deck.firstElementChild) {
            yield `${this.id} draws a card`;
            hand.appendChild(deck.firstElementChild);
        } else {
            yield "but the deck is empty";
        }
    }

    *RivalAI() {
        // TODO Pick a card that can be played this turn given its cost.
        // TODO Add a while loop.
        let card = element(this.querySelectorAll<CardElement>("a-hand a-card")).Controller;

        let battle = this.closest<BattleController>("battle-controller")!;
        let empty_slots = battle.querySelectorAll<LocationSlot>(
            "location-owner[slot=rival] location-slot:not(:has(a-card))",
        );
        let slot = element(empty_slots);
        let location = slot.closest<LocationElement>("a-location")!.Controller;
        yield `rival plays ${card.Name} to ${location.Name}`;
        slot.appendChild(card);
        battle.PlayedCardsQueue.push(card);
    }
}

customElements.define("actor-controller", ActorController);
