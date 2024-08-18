import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {next_id} from "../lib/id.js";
import {Sprites} from "../sprites/sprites.js";
import {ActorController} from "./ActorController.js";
import {BattleController} from "./BattleController.js";
import {LocationController} from "./LocationController.js";

export abstract class CardController extends HTMLElement {
    abstract Name: string;
    abstract Cost: number;
    abstract Power: number;
    abstract Text: string;
    abstract Sprite: Sprites;

    Id = next_id();
    IsRevealed = false;

    connectedCallback() {
        this.innerHTML = `
            <a-card name="${this.Name}" cost="${this.CurrentCost}" power="${this.CurrentPower}" text="${this.Text}" image="${this.Sprite}" onclick="this.nextElementSibling.showModal();"></a-card>
        `;

        this.draggable = true;
        this.id = this.Id.toString();

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

    get CurrentCost() {
        let result = this.Cost;
        for (let modifier of this.querySelectorAll("a-modifier")) {
            let op = modifier.getAttribute("op")!;
            let value = parseInt(modifier.getAttribute("value")!);
            switch (op) {
                case "addcost":
                    result += value;
                    break;
            }
        }
        return result;
    }

    get CurrentPower() {
        let result = this.Cost;
        for (let modifier of this.querySelectorAll("a-modifier")) {
            let op = modifier.getAttribute("op")!;
            let value = parseInt(modifier.getAttribute("value")!);
            switch (op) {
                case "addpower":
                    result += value;
                    break;
            }
        }
        return result;
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
    get Rival(): ActorController {
        let all_actors = Array.from(document.querySelectorAll("actor-controller")) as ActorController[];
        return all_actors.find((actor) => actor !== this.Owner)!;
    }

    get Battle(): BattleController {
        return this.closest("battle-controller") as BattleController;
    }

    get Location(): LocationController {
        return (this.closest("a-location") as LocationElement).Controller;
    }

    get Element(): CardElement {
        return this.querySelector("a-card") as CardElement;
    }

    AddModifier(origin: CardController, op: string, value: number) {
        let modifier = document.createElement("a-modifier")!;
        modifier.setAttribute("origin-id", origin.id);
        modifier.setAttribute("origin-name", origin.Name);
        modifier.setAttribute("op", op);
        modifier.setAttribute("value", value.toString());
        this.querySelector("a-card")!.appendChild(modifier);

        let card_element = this.querySelector("a-card")!;
        card_element.setAttribute("cost", this.CurrentCost.toString());
        card_element.setAttribute("power", this.CurrentPower.toString());
    }

    *Reveal() {
        yield `${this.Name} is revealed`;
        this.querySelector("a-card")!.classList.add("frontside");
        yield* this.OnReveal();
        this.IsRevealed = true;
    }

    *OnReveal() {
        yield `it does nothing special`;
    }

    *OnTrash() {
        // The default teardown is to remove all modifiers that originated from this card.
        let modifiers = this.querySelectorAll(`a-modifier[origin-id=${this.id}]`);
        for (let modifier of modifiers) {
            modifier.remove();
        }
    }

    *OnCardMessage(kind: string, card: CardController): Generator<string, void> {}

    handleEvent(event: Event) {}
}
