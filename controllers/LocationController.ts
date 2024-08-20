import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {Message} from "../messages.js";
import {CardController} from "./CardController.js";

export abstract class LocationController {
    abstract Name: string;
    abstract Description: string;

    constructor(public Element: LocationElement) {}

    GetRevealedCards(actor?: string) {
        let root = actor ? this.Element.querySelector(`location-owner[slot=${actor}]`)! : this.Element;
        return Array.from(root.querySelectorAll<CardElement>("a-card"))
            .map((card) => card.Controller)
            .filter((card) => card.IsRevealed);
    }

    *OnMessage(kind: Message, card?: CardController): Generator<string, void> {}

    *AddCard(card: CardController, owner: string, slot_index?: number) {
        const side = this.Element.querySelector(`location-owner[slot=${owner}]`)!;
        if (slot_index === undefined) {
            let slot = side.querySelector("location-slot:not(:has(a-card))");
            if (slot) {
                slot.appendChild(card);
                yield* card.Reveal();
            } else {
                yield "no empty slots";
            }
        } else {
            const slot = side.querySelector(`location-slot[label=${slot_index + 1}]`)!;
            if (slot) {
                slot.appendChild(card);
                yield* card.Reveal();
            } else {
                yield "but the slot is already occupied";
            }
        }
    }
}
