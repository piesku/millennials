import {CardController} from "./CardController.js";

export abstract class LocationController extends HTMLElement {
    abstract Name: string;
    abstract Description: string;

    connectedCallback() {
        this.innerHTML = `
            <a-location name="${this.Name}" description="${this.Description}"></a-location>
        `;
    }

    *AddCard(card: CardController, owner: string, slot_index?: number) {
        const side = this.querySelector(`location-owner[slot=${owner}]`)!;
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
