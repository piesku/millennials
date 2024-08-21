import {ActorElement} from "../elements/a-actor.js";
import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {next_id} from "../lib/id.js";
import {Message} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {ActorController} from "./ActorController.js";
import {BattleController} from "./BattleController.js";
import {LocationController} from "./LocationController.js";

export abstract class CardController {
    abstract Name: string;
    abstract Cost: number;
    abstract Power: number;
    abstract Text: string;
    abstract Sprite: Sprites;

    Id = next_id();
    IsRevealed = false;
    TurnPlayed = 0;

    constructor(public Element: CardElement) {}

    get CurrentCost() {
        let result = this.Cost;
        for (let modifier of this.Element.querySelectorAll("a-modifier")) {
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
        let result = this.Power;
        for (let modifier of this.Element.querySelectorAll("a-modifier")) {
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
        let location_owner = this.Element.closest("location-owner");
        if (location_owner) {
            let actor_id = location_owner.getAttribute("slot")!;
            let actor = document.getElementById(actor_id) as ActorElement;
            return actor.Instance;
        } else {
            let actor_element = this.Element.closest("a-actor") as ActorElement;
            return actor_element.Instance;
        }
    }

    get Rival(): ActorController {
        let actor_id = this.Owner.Type === "player" ? "villain" : "player";
        let actor = document.getElementById(actor_id) as ActorElement;
        return actor.Instance;
    }

    get Battle(): BattleController {
        return this.Element.closest("battle-controller") as BattleController;
    }

    get Location(): LocationController {
        return (this.Element.closest("a-location") as LocationElement).Instance;
    }

    AddModifier(origin: CardController, op: string, value: number) {
        let modifier = document.createElement("a-modifier")!;
        modifier.setAttribute("origin-id", origin.Id.toString());
        modifier.setAttribute("origin-name", origin.Name);
        modifier.setAttribute("op", op);
        modifier.setAttribute("value", value.toString());
        this.Element.appendChild(modifier);

        // TODO Perhaps a MutationObserver would be a better way to handle this?
        this.Element.ReRender();
    }

    *Reveal() {
        yield `${this.Name} is revealed`;
        this.Element.classList.add("frontside");
        yield* this.OnReveal();
        this.IsRevealed = true;
        this.TurnPlayed = this.Battle.CurrentTurn;
    }

    *OnReveal(): Generator<string, void> {
        // yield `it does nothing special`;
    }

    *OnTrash() {
        // The default teardown is to remove all modifiers that originated from this card.
        let modifiers = this.Element.querySelectorAll(`a-modifier[origin-id=${this.Id}]`);
        for (let modifier of modifiers) {
            modifier.remove();
        }
    }

    *OnMessage(kind: Message, card?: CardController): Generator<string, void> {}

    *Trash() {
        const actor = this.Owner;
        if (actor) {
            const trashElement = actor.Element.querySelector("a-trash");
            if (trashElement) {
                this.OnTrash();
                trashElement.appendChild(this.Element);
                yield `${this.Name} has been moved to the trash`;
            } else {
                yield `No trash element found for actor ${this.Owner}`;
            }
        } else {
            yield `No actor found for owner ${this.Owner}`;
        }
    }
}
