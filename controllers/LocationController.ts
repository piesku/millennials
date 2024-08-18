import {CardElement} from "../elements/a-card.js";
import {CardController} from "./CardController.js";

export abstract class LocationController extends HTMLElement {
    abstract Name: string;
    abstract Description: string;

    connectedCallback() {
        this.innerHTML = `
            <a-location name="${this.Name}" description="${this.Description}">
                <location-owner slot="player">
                    <location-slot label=1></location-slot>
                    <location-slot label=2></location-slot>
                    <location-slot label=3></location-slot>
                    <location-slot label=4></location-slot>
                </location-owner>

                <location-owner slot="rival" reverse>
                    <location-slot label=1></location-slot>
                    <location-slot label=2></location-slot>
                    <location-slot label=3></location-slot>
                    <location-slot label=4></location-slot>
                </location-owner>
            </a-location>
        `;
    }

    GetRevealedCards(actor?: string) {
        let root = actor ? this.querySelector(`location-owner[slot=${actor}]`)! : this;
        return Array.from(root.querySelectorAll<CardElement>("a-card"))
            .map((card) => card.Controller)
            .filter((card) => card.IsRevealed);
    }

    *OnCardMessage(kind: string, card: CardController) {}

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
