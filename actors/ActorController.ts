import {ActorElement} from "../elements/a-actor.js";
import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {BattleScene} from "../elements/battle-scene.js";
import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";

export abstract class ActorController {
    abstract Type: "player" | "villain";
    abstract Name: string;
    abstract Sprite: Sprites;
    abstract Description: string;
    MaxEnergy = 0;
    CurrentEnergy = 0;

    constructor(public Element: ActorElement) {}

    abstract StartBattle(trace: Trace): Generator<[Trace, string], void>;

    *StartTurn(turn: number, trace: Trace) {
        yield* this.DrawCard(trace);

        this.CurrentEnergy = this.MaxEnergy = turn;
        this.Element.ReRender();
    }

    *DrawCard(trace: Trace, target?: Element) {
        const hand = this.Element.querySelector("a-hand")!;
        const deck = target ?? this.Element.querySelector("a-deck")!;

        if (deck.firstElementChild && hand.children.length >= 7) {
            yield trace.log("but the hand is full");
        } else if (deck.firstElementChild) {
            let card = deck.firstElementChild! as CardElement;
            if (this.Type === "villain") {
                yield trace.log(`${this.Name} draws a card`);
            } else {
                yield trace.log(`${this.Name} draw ${card.Instance.Name}`);
                card.setAttribute("draggable", "true");
            }
            hand.appendChild(card);
        } else {
            yield trace.log("but the deck is empty");
        }
    }

    *RivalAI(trace: Trace) {
        while (true) {
            let playableCards = Array.from(this.Element.querySelectorAll<CardElement>("a-hand a-card")).filter(
                (card) => card.Instance.CurrentCost <= this.CurrentEnergy,
            );

            if (playableCards.length === 0) {
                break;
            }

            let card = element(playableCards);

            let battle = this.Element.closest<BattleScene>("battle-scene")!;
            let empty_slots = battle.GetEmptySlots(this);
            let slot = element(empty_slots);
            let location = slot.closest<LocationElement>("a-location")!.Instance;
            if (this.Element.id === "villain") {
                yield trace.log(`${this.Name} plays a card to ${location.Name}`);
            } else {
                yield trace.log(`${this.Name} plays ${card.Instance.Name} to ${location.Name}`);
            }
            slot.appendChild(card);
            battle.PlayedCardsQueue.push(card.Instance);

            this.CurrentEnergy -= card.Instance.CurrentCost;
            this.Element.ReRender();
        }
    }
}
