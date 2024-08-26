import {ActorController} from "../actors/ActorController.js";
import {ActorElement} from "../elements/a-actor.js";
import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {BattleScene} from "../elements/battle-scene.js";
import {next_id} from "../lib/id.js";
import {LocationController} from "../locations/LocationController.js";
import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";

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

    get Battle(): BattleScene {
        return this.Element.closest("battle-scene") as BattleScene;
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

    *Reveal(trace: Trace) {
        if (trace.length === 0) {
            yield trace.log(`${this.Name} is revealed`);
        }
        this.Element.classList.add("frontside");
        yield* this.OnReveal(trace.fork());
        this.IsRevealed = true;
        this.TurnPlayed = this.Battle.CurrentTurn;

        yield* this.Battle.BroadcastCardMessage(Message.CardEntersTable, trace.fork(), this);
    }

    *OnReveal(trace: Trace): Generator<[Trace, string], void> {
        // yield trace.log(`it does nothing special`);
    }

    *OnTrash(trace: Trace): Generator<[Trace, string], void> {
        // The default teardown is to remove all modifiers that originated from this card.
        let modifiers = this.Element.querySelectorAll(`a-modifier[origin-id=${this.Id}]`);
        for (let modifier of modifiers) {
            modifier.remove();
        }
    }

    *OnMessage(kind: Message, trace: Trace, card?: CardController): Generator<[Trace, string], void> {}

    *Trash(trace: Trace) {
        const actor = this.Owner;
        if (actor) {
            const trashElement = actor.Element.querySelector("a-trash");
            if (trashElement) {
                yield* this.OnTrash(trace);
                trashElement.appendChild(this.Element);
                yield trace.log(`${this.Name} has been moved to the trash`);
            } else {
                yield trace.log(`No trash element found for actor ${this.Owner}`);
            }
        } else {
            yield trace.log(`No actor found for owner ${this.Owner}`);
        }
    }
}
