import {ActorController} from "../actors/ActorController.js";
import {CardController} from "../cards/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {LocationSlot} from "../elements/location-slot.js";
import {Message, Trace} from "../messages.js";

export abstract class LocationController {
    abstract Name: string;
    abstract Description: string;

    constructor(public Element: LocationElement) {}

    GetRevealedCards(actor?: ActorController) {
        let root = actor ? this.Element.querySelector(`location-owner[slot=${actor.Type}]`)! : this.Element;
        return Array.from(root.querySelectorAll<CardElement>("a-card"))
            .map((card) => card.Instance)
            .filter((card) => card.IsRevealed);
    }

    GetEmptySlots(actor: ActorController) {
        return this.Element.querySelectorAll<LocationSlot>(
            `location-owner[slot=${actor.Type}] location-slot:not(:has(a-card))`,
        );
    }

    CleanUp(card: CardController) {
        let modifiers = this.Element.querySelectorAll(`a-modifier[origin-id="${card.Id}"]`);
        for (let modifier of modifiers) {
            modifier.remove();
        }
    }

    *OnMessage(kind: Message, trace: Trace, card?: CardController): Generator<[Trace, string], void> {}

    *AddCard(card: CardController, trace: Trace, owner: ActorController, slot_index?: number) {
        const side = this.Element.querySelector(`location-owner[slot=${owner.Type}]`)!;
        let slot =
            slot_index === undefined
                ? side.querySelector("location-slot:not(:has(a-card))")
                : side.querySelector(`location-slot[label=${slot_index + 1}]`);
        if (slot) {
            if (card.Element.closest("a-hand")) {
                yield* owner.Battle.BroadcastCardMessage(Message.CardLeavesHand, trace, card);
            } else if (card.Element.closest("a-deck")) {
                yield* owner.Battle.BroadcastCardMessage(Message.CardLeavesDeck, trace, card);
            } else if (card.Element.closest("a-trash")) {
                yield* owner.Battle.BroadcastCardMessage(Message.CardLeavesTrash, trace, card);
            }
            slot.appendChild(card.Element);
            yield* card.Reveal(trace);
        } else if (slot_index === undefined) {
            yield trace.log("but there are no empty slots");
        } else {
            yield trace.log("but the slot is already occupied");
        }
    }
}
