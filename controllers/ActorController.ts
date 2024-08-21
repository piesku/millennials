import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {LocationSlot} from "../elements/location-slot.js";
import {html} from "../lib/html.js";
import {element} from "../lib/random.js";
import {BattleController} from "./BattleController.js";

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

    *DrawCard(target?: Element) {
        const hand = this.querySelector("a-hand")!;
        const deck = target ?? this.querySelector("a-deck")!;

        if (deck.firstElementChild && hand.children.length >= 7) {
            yield "but the hand is full";
        } else if (deck.firstElementChild) {
            let card = deck.firstElementChild! as CardElement;
            if (this.id === "rival") {
                yield `${this.Name} draws a card`;
            } else {
                yield `${this.Name} draw ${card.Instance.Name}`;
            }
            hand.appendChild(card);
        } else {
            yield "but the deck is empty";
        }
    }

    *RivalAI(): Generator<string, void> {
        while (true) {
            let playableCards = Array.from(this.querySelectorAll<CardElement>("a-hand a-card")).filter(
                (card) => card.Instance.CurrentCost <= this.CurrentEnergy,
            );

            if (playableCards.length === 0) {
                break;
            }

            let card = element(playableCards);

            let battle = this.closest<BattleController>("battle-controller")!;
            let empty_slots = battle.querySelectorAll<LocationSlot>(
                "location-owner[slot=rival] location-slot:not(:has(a-card))",
            );
            let slot = element(empty_slots);
            let location = slot.closest<LocationElement>("a-location")!.Instance;
            if (this.id === "rival") {
                yield `${this.Name} plays a card to ${location.Name}`;
            } else {
                yield `${this.Name} plays ${card.Instance.Name} to ${location.Name}`;
            }
            slot.appendChild(card);
            battle.PlayedCardsQueue.push(card.Instance);

            this.CurrentEnergy -= card.Instance.CurrentCost;
            this.ReRender();
        }
    }
}
