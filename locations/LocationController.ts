import {ActorController} from "../actors/ActorController.js";
import {CardController} from "../cards/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
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

    *OnMessage(kind: Message, trace: Trace, card?: CardController): Generator<[Trace, string], void> {}

    *AddCard(card: CardController, trace: Trace, owner: ActorController, slot_index?: number) {
        const side = this.Element.querySelector(`location-owner[slot=${owner.Type}]`)!;
        if (slot_index === undefined) {
            let slot = side.querySelector("location-slot:not(:has(a-card))");
            if (slot) {
                slot.appendChild(card.Element);
                yield* card.Reveal(trace);
            } else {
                yield trace.log("no empty slots");
            }
        } else {
            const slot = side.querySelector(`location-slot[label=${slot_index + 1}]`)!;
            if (slot) {
                slot.appendChild(card.Element);
                yield* card.Reveal(trace);
            } else {
                yield trace.log("but the slot is already occupied");
            }
        }
    }
}
