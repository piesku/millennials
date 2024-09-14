import {ActorController} from "../actors/ActorController.js";
import {CardController} from "../cards/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {BattleScene} from "../elements/battle-scene.js";
import {next_id} from "../lib/id.js";
import {Message, Trace} from "../messages.js";
import {CollectionFlag, save_card_state} from "../storage.js";

export const enum LocationType {
    DrawACard,
    GainTwoPower,
    TransformSameCost,
    FillWithClones,
    GainOneEnergy,
    GainOneEnergyEmpty,
    GiveCostHand,
    LoseOnePower,
    OnceDontWork,
    OneTwoThree,
    TrashFourthTurn,
    TurnSeven,
    WinnerDrawsTwo,
    NoOp,
    CopyToOwnerHand,
    CopyToOpponentHand,
    ReturnToOwnerHand,
    ShuffleMarbles,
    CantPlayHere,
}

export abstract class LocationController {
    abstract Description: string;

    Id = next_id();
    IsRevealed = false;

    constructor(public Element: LocationElement) {}

    toString() {
        return `<span class="location" for="${this.Id}">${this.Name}</span>`;
    }

    get Name() {
        return this.Element.title + " Location";
    }

    get Battle() {
        return this.Element.closest<BattleScene>("battle-scene")!;
    }

    GetSide(actor: ActorController) {
        let side = this.Element.querySelector(`location-owner[slot=${actor.Type}]`);
        DEBUG: if (!side) {
            throw "Location must have a side for the " + actor.Type;
        }
        return side;
    }

    GetScore(actor: ActorController) {
        let revealed_cards = this.GetRevealedCards(actor);
        let total_power = revealed_cards.map((card) => card.CurrentPower).reduce((a, b) => a + b, 0);
        let doublers = revealed_cards.filter((card) => card.Name === "Ron Jambo");
        for (let _ of doublers) {
            total_power *= 2;
        }
        return total_power;
    }

    GetRevealedCards(actor?: ActorController) {
        let root = actor ? this.Element.querySelector(`location-owner[slot="${actor.Type}"]`)! : this.Element;
        if (!root) {
            return [];
        }
        return Array.from(root.querySelectorAll<CardElement>("a-card"))
            .map((card) => card.Controller)
            .filter((card) => card.IsRevealed);
    }

    IsFull(actor: ActorController) {
        return this.Element.querySelectorAll<CardElement>(`location-owner[slot=${actor.Type}] a-card`).length === 4;
    }

    CleanUp(card: CardController) {
        let modifiers = this.Element.querySelectorAll(`a-modifier[origin-id="${card.Id}"]`);
        for (let modifier of modifiers) {
            modifier.remove();
        }
    }

    CanBePlayedHere(card: CardController) {
        return true;
    }

    CanOnRevealHere(card: CardController) {
        return true;
    }

    *Reveal(trace: Trace) {
        if (trace.length === 0) {
            yield trace.Log(`${this} is revealed`);
        }
        this.Element.classList.add("frontside", "hilite");
        yield* this.OnReveal(trace.Fork(this));
        this.IsRevealed = true;

        // TODO Broadcast?
    }

    *OnReveal(trace: Trace): Generator<[Trace, string], void> {}

    *OnMessage(kind: Message, trace: Trace, card?: CardController): Generator<[Trace, string], void> {}

    *AddCard(card: CardController, trace: Trace, actor: ActorController, skip_reveal?: boolean) {
        if (this.IsFull(actor)) {
            yield trace.Log(`but ${this} is full`);
        } else {
            if (card.Element.closest("a-hand")) {
                yield* actor.Battle.BroadcastCardMessage(Message.CardLeavesHand, trace, card);
            } else if (card.Element.closest("a-deck")) {
                // yield* actor.Battle.BroadcastCardMessage(Message.CardLeavesDeck, trace, card);
            } else if (card.Element.closest("a-trash")) {
                yield* actor.Battle.BroadcastCardMessage(Message.CardLeavesTrash, trace, card);
            }

            let side = this.GetSide(actor);
            side.append(card.Element);

            if (!skip_reveal) {
                yield* card.Reveal(trace);
            }

            // Update the collection state.
            save_card_state(card, CollectionFlag.Seen);
        }
    }
}
