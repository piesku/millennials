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

    get Opponent(): ActorController {
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

    *OnMessage(kind: Message, trace: Trace, card?: CardController): Generator<[Trace, string], void> {}

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

    *Trash(trace: Trace) {
        const actor = this.Owner;
        const trashElement = actor.Element.querySelector("a-trash")!;
        yield* this.OnTrash(trace);
        trashElement.appendChild(this.Element);
        yield trace.log(`${this.Name} has been moved to the trash`);
    }

    *OnTrash(trace: Trace): Generator<[Trace, string], void> {
        // The default teardown is to remove all modifiers that originated from this card.
        let modifiers = this.Element.querySelectorAll(`a-modifier[origin-id="${this.Id}"]`);
        for (let modifier of modifiers) {
            modifier.remove();
        }
    }

    *Move(trace: Trace, slot: HTMLElement, owner?: ActorController): Generator<[Trace, string], void> {
        owner = owner ?? this.Owner;

        const current_location = this.Location;
        const target_location = slot.closest<LocationElement>("a-location")!.Instance;

        const is_slot_taken = !!slot.querySelector("a-card");
        if (!is_slot_taken) {
            yield* this.Battle.BroadcastCardMessage(Message.CardMovesFromLocation, trace.fork(), this);
            slot.appendChild(this.Element);
            yield* this.OnMove(trace);
            yield trace.log(`${this.Name} moved from ${current_location.Name} to ${target_location.Name} `);
            yield* this.Battle.BroadcastCardMessage(Message.CardMovesToLocation, trace.fork(), this);
            this.OnMove(trace.fork());
        } else {
            yield trace.log(
                `${this.Name} could not move to ${target_location.Name} because the slot nr ${slot} is already taken`,
            );
        }
    }

    *OnMove(trace: Trace): Generator<[Trace, string], void> {
        // yield trace.log(`it does nothing special`);
    }
}
