import {ActorElement} from "../elements/a-actor.js";
import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {BattleScene} from "../elements/battle-scene.js";
import {LocationSlot} from "../elements/location-slot.js";
import {element} from "../lib/random.js";

export abstract class ActorController {
    abstract Type: "player" | "villain";
    abstract Name: string;
    MaxEnergy = 0;
    CurrentEnergy = 0;

    constructor(public Element: ActorElement) {}

    abstract StartBattle(): Generator<string, void>;

    *StartTurn(turn: number) {
        yield* this.DrawCard();

        this.CurrentEnergy = this.MaxEnergy = turn;
        this.Element.ReRender();
    }

    *DrawCard(target?: Element) {
        const hand = this.Element.querySelector("a-hand")!;
        const deck = target ?? this.Element.querySelector("a-deck")!;

        if (deck.firstElementChild && hand.children.length >= 7) {
            yield "but the hand is full";
        } else if (deck.firstElementChild) {
            let card = deck.firstElementChild! as CardElement;
            if (this.Element.id === "villain") {
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
            let playableCards = Array.from(this.Element.querySelectorAll<CardElement>("a-hand a-card")).filter(
                (card) => card.Instance.CurrentCost <= this.CurrentEnergy,
            );

            if (playableCards.length === 0) {
                break;
            }

            let card = element(playableCards);

            let battle = this.Element.closest<BattleScene>("battle-scene")!;
            let empty_slots = battle.querySelectorAll<LocationSlot>(
                "location-owner[slot=villain] location-slot:not(:has(a-card))",
            );
            let slot = element(empty_slots);
            let location = slot.closest<LocationElement>("a-location")!.Instance;
            if (this.Element.id === "villain") {
                yield `${this.Name} plays a card to ${location.Name}`;
            } else {
                yield `${this.Name} plays ${card.Instance.Name} to ${location.Name}`;
            }
            slot.appendChild(card);
            battle.PlayedCardsQueue.push(card.Instance);

            this.CurrentEnergy -= card.Instance.CurrentCost;
            this.Element.ReRender();
        }
    }
}
