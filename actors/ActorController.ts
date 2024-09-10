import {ActorElement} from "../elements/a-actor.js";
import {CardElement} from "../elements/a-card.js";
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

    toString() {
        return `<log-chip class="actor">${this.Name}</log-chip>`;
    }

    get Battle() {
        let battle = this.Element.closest<BattleScene>("battle-scene");
        DEBUG: if (!battle) {
            throw "Actor must be inside a battle";
        }
        return battle;
    }

    get Deck() {
        let deck = this.Element.querySelector("a-deck");
        DEBUG: if (!deck) {
            throw "Actor must have a deck";
        }
        return deck;
    }

    get Hand() {
        let hand = this.Element.querySelector("a-hand");
        DEBUG: if (!hand) {
            throw "Actor must have a hand";
        }
        return hand;
    }

    GetScore() {
        let score = 0;
        for (const location of this.Battle.Locations) {
            score += location.GetScore(this);
        }
        return score;
    }

    abstract StartBattle(trace: Trace): Generator<[Trace, string], void>;

    *StartTurn(turn: number, trace: Trace) {
        yield* this.DrawCard(trace);

        this.CurrentEnergy = this.MaxEnergy = turn;
        this.Element.Render();
    }

    *DrawCard(trace: Trace, from?: Element) {
        const deck = from ?? this.Deck;

        if (deck.firstElementChild && this.Hand.children.length >= 7) {
            yield trace.log(`${this} draw a card`);
            yield trace.fork(1).log("but the hand is full");
        } else if (deck.firstElementChild) {
            let card = deck.firstElementChild! as CardElement;

            if (this.Type === "player") {
                card.setAttribute("draggable", "true");
                yield trace.log(`${this} draw ${card.Instance}`);
            } else {
                yield trace.log(`${this} draw a card`);
            }

            yield* this.Battle.BroadcastCardMessage(Message.CardLeavesDeck, trace, card.Instance);
            this.Hand.appendChild(card);
            yield* this.Battle.BroadcastCardMessage(Message.CardEntersHand, trace, card.Instance);
        } else {
            yield trace.log(`${this} draw a card`);
            yield trace.fork(1).log("but the deck is empty");
        }
    }

    *VillAIn(trace: Trace) {
        while (true) {
            let playable_cards = Array.from(this.Element.querySelectorAll<CardElement>("a-hand a-card")).filter(
                (card) => card.Instance.CurrentCost <= this.CurrentEnergy,
            );

            if (playable_cards.length === 0) {
                break;
            }

            let card = playable_cards[0];
            for (let i = 1; i < playable_cards.length; i++) {
                if (playable_cards[i].Instance.CurrentCost > card.Instance.CurrentCost) {
                    card = playable_cards[i];
                }
            }

            let empty_locations = this.Battle.Locations.filter((location) => !location.IsFull(this));
            let possible_locations = empty_locations.filter((location) => location.CanBePlayedHere(card.Instance));

            if (!possible_locations) {
                break;
            }

            let location = element(empty_locations);

            yield trace.log(`${this} play a card to ${location}`);

            location.GetSide(this).appendChild(card);
            this.Battle.PlayedCardsQueue.push(card.Instance);

            this.CurrentEnergy -= card.Instance.CurrentCost;
            this.Element.Render();
        }
    }
}
