import {LocationElement} from "../elements/a-location.js";
import {next_id} from "../lib/id.js";
import {Sprites} from "../sprites/sprites.js";
import {ActorController} from "./actor-controller.js";
import {LocationController} from "./LocationController.js";

export abstract class CardController extends HTMLElement {
    abstract Name: string;
    abstract Cost: number;
    abstract Power: number;
    abstract Text: string;
    abstract Sprite: Sprites;

    IsRevealed = false;

    connectedCallback() {
        this.innerHTML = `
            <a-card name="${this.Name}" cost="${this.Cost}" power="${this.Power}" text="${this.Text}" image="${this.Sprite}"></a-card>
        `;

        this.draggable = true;
        this.id = next_id().toString();

        this.addEventListener("dragstart", (e) => {
            let target = e.target as HTMLElement;
            if (e.dataTransfer) {
                e.dataTransfer.setData("text/plain", target.id);
                target.classList.add("dragging");
            }
        });

        this.addEventListener("dragend", (e) => {
            let target = e.target as HTMLElement;
            target.classList.remove("dragging");
        });

        this.addEventListener("CardEntersTable", this);
    }

    get Owner(): ActorController {
        let location_owner = this.closest("location-owner");
        if (location_owner) {
            let actor_id = location_owner.getAttribute("slot")!;
            return document.getElementById(actor_id) as ActorController;
        } else {
            return this.closest("actor-controller") as ActorController;
        }
    }

    get Location(): LocationController {
        return (this.closest("a-location") as LocationElement).Controller;
    }

    *Reveal() {
        yield `${this.Name} is revealed`;
        this.IsRevealed = true;
        this.querySelector("a-card")!.setAttribute("revealed", "");
    }

    handleEvent(event: Event) {}
}
