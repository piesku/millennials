import {ActorElement} from "../elements/a-actor.js";
import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {BattleScene} from "../elements/battle-scene.js";
import {element} from "../lib/random.js";
import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";

export abstract class ActorController {
    abstract Type: "player" | "villain";
    abstract Name: string;
    abstract Sprite: Sprites;
    abstract Description: string;
    MaxEnergy = 0;
    CurrentEnergy = 0;

    constructor(public Element: ActorElement) {}

    get Battle() {
        let battle = this.Element.closest<BattleScene>("battle-scene");
        DEBUG: if (!battle) {
            throw "Actor must be inside a battle";
        }
        return battle;
    }

    get Hand() {
        let hand = this.Element.querySelector("a-hand");
        DEBUG: if (!hand) {
            throw "Actor must have a hand";
        }
        return hand;
    }

    abstract StartBattle(trace: Trace): Generator<[Trace, string], void>;

    *StartTurn(turn: number, trace: Trace) {
        yield* this.DrawCard(trace);

        this.CurrentEnergy = this.MaxEnergy = turn;
        this.Element.Render();
    }

    *DrawCard(trace: Trace, target?: Element) {
        const hand = this.Element.querySelector("a-hand")!;
        const deck = target ?? this.Element.querySelector("a-deck")!;

        if (this.Type === "player") {
            yield trace.log(`${this.Name} draw a card`);
        } else {
            yield trace.log(`${this.Name} draws a card`);
        }

        if (deck.firstElementChild && hand.children.length >= 7) {
            yield trace.fork(1).log("but the hand is full");
        } else if (deck.firstElementChild) {
            let card = deck.firstElementChild! as CardElement;
            card.setAttribute("draggable", "true");

            if (this.Type === "player") {
                yield trace.fork(1).log(`it's ${card.Instance.Name}`);
            }

            yield* this.Battle.BroadcastCardMessage(Message.CardLeavesDeck, trace, card.Instance);
            hand.appendChild(card);
            yield* this.Battle.BroadcastCardMessage(Message.CardEntersHand, trace, card.Instance);
        } else {
            yield trace.fork(1).log("but the deck is empty");
        }
    }

    *VillAIn(trace: Trace) {
        while (true) {
            let playableCards = Array.from(this.Element.querySelectorAll<CardElement>("a-hand a-card")).filter(
                (card) => card.Instance.CurrentCost <= this.CurrentEnergy,
            );

            if (playableCards.length === 0) {
                break;
            }

            let card = element(playableCards);

            let empty_slots = this.Battle.GetEmptySlots(this);
            let slot = element(empty_slots);
            let location = slot.closest<LocationElement>("a-location")!.Instance;
            if (this.Element.id === "villain") {
                yield trace.log(`${this.Name} plays a card to ${location.Name}`);
            } else {
                yield trace.log(`${this.Name} plays ${card.Instance.Name} to ${location.Name}`);
            }
            slot.appendChild(card);
            this.Battle.PlayedCardsQueue.push(card.Instance);

            this.CurrentEnergy -= card.Instance.CurrentCost;
            this.Element.Render();
        }
    }
}
