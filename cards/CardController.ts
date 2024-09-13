import {ActorController} from "../actors/ActorController.js";
import {ActorElement} from "../elements/a-actor.js";
import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {BattleScene} from "../elements/battle-scene.js";
import {next_id} from "../lib/id.js";
import {element} from "../lib/random.js";
import {LocationController} from "../locations/LocationController.js";
import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CollectionFlag, save_card_state} from "../storage.js";

export abstract class CardController {
    abstract Name: string;
    abstract Cost: number;
    abstract Power: number;
    abstract Description: string;
    abstract Sprite: Sprites;

    Id = next_id();
    IsVillain = false;
    IsRevealed = false;
    TurnPlayed = 0;
    SpriteOffset = 0;

    constructor(public Element: CardElement) {}

    toString() {
        return `<log-chip class="card" for="${this.Id}">${this.Name}</log-chip>`;
    }

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
                case "setpower":
                    result = value;
                    break;
            }
        }
        return result;
    }

    get Owner(): ActorController {
        let location_owner = this.Element.closest("location-owner");
        if (location_owner) {
            let actor_id = location_owner.getAttribute("slot")!;
            let actor = this.Battle.querySelector("#" + actor_id) as ActorElement;
            return actor.Controller;
        } else {
            let actor_element = this.Element.closest("a-actor") as ActorElement;
            return actor_element.Controller;
        }
    }

    get Opponent(): ActorController {
        let actor_id = this.Owner.Type === "player" ? "villain" : "player";
        let actor = this.Battle.querySelector("#" + actor_id) as ActorElement;
        return actor.Controller;
    }

    get Battle(): BattleScene {
        return this.Element.closest<BattleScene>("battle-scene")!;
    }

    get Field(): LocationController | undefined {
        let location = this.Element.closest<LocationElement>("a-location");
        return location?.Controller;
    }

    AddModifier(origin: CardController | LocationController, op: string, value: number) {
        let modifier = document.createElement("a-modifier")!;
        modifier.setAttribute("origin-id", origin.Id.toString());
        modifier.setAttribute("origin-name", origin.Name);
        modifier.setAttribute("op", op);
        modifier.setAttribute("value", value.toString());
        this.Element.append(modifier);

        // TODO Perhaps a MutationObserver would be a better way to handle this?
        this.Element.Render();

        let text = "";
        switch (op) {
            case "addpower":
            case "addcost": {
                let amount = value > 0 ? "+" + value : value;
                text = `${this} gains ${amount} ${op.slice(3)}${origin === this ? "" : ` from ${origin}`}`;
                break;
            }
            case "setpower":
            case "setcost": {
                text = `${this} has ${value} ${op.slice(3)}${origin === this ? "" : ` from ${origin}`}`;
                break;
            }
        }

        return (modifier.innerHTML = text);
    }

    RemoveModifiers(origin: CardController | LocationController) {
        const modifiers = this.Element.querySelectorAll(`a-modifier[origin-id="${origin.Id}"]`);
        for (let modifier of modifiers) {
            this.Element.removeChild(modifier);
        }
        this.Element.Render();
    }

    HasModifiers(origin: CardController | LocationController): boolean {
        const modifiers = this.Element.querySelectorAll(`a-modifier[origin-id="${origin.Id}"]`);
        return modifiers.length > 0;
    }
    /**
     * Handles messages targeting other cards, as well as system messages (when
     * `card` is `undefined`).
     *
     * When the message is broadcast, the target card is present in the
     * container mentioned in the message:
     *
     * * `CardLeavesHand` — the card is **still** in the hand.
     * * `CardEntersHand` — the card is **already** in the hand.
     */
    *OnMessage(kind: Message, trace: Trace, card?: CardController): Generator<[Trace, string], void> {}

    /**
     * Handles messages targeting **this card**.
     *
     * When the message is broadcast, the card is present in the container
     * mentioned in the message:
     *
     * * `CardLeavesHand` — the card is **still** in the hand.
     * * `CardEntersHand` — the card is **already** in the hand.
     */
    *OnMessageSelf(kind: Message, trace: Trace): Generator<[Trace, string], void> {}

    *Reveal(trace: Trace, broadcast = true) {
        DEBUG: if (!this.Field) {
            throw `${this} must be in a location to be revealed`;
        }
        if (trace.length === 0) {
            yield trace.Log(`${this.Owner} reveal ${this} in ${this.Field}`);
        }
        this.Element.classList.add("frontside");
        this.Element.classList.remove("unplayable");
        if (!this.Field.IsRevealed || this.Field.CanOnRevealHere(this)) {
            yield* this.OnReveal(trace.Fork(this));
        }
        this.IsRevealed = true;
        this.TurnPlayed = this.Battle.CurrentTurn;

        // Update the collection state.
        if (save_card_state(this, CollectionFlag.Seen)) {
            yield trace.Fork(1).Log(`you see ${this} for the first time!`);
        }

        if (broadcast) {
            yield* this.Battle.BroadcastCardMessage(Message.CardEntersTable, trace, this);
        }
    }

    /**
     * Happens **before** the card is revealed.
     *
     * The card is already on the table face-up, but `GetRevealedCards` will not
     * include it.
     */
    *OnReveal(trace: Trace): Generator<[Trace, string], void> {
        // yield trace.log(`it does nothing special`);
    }

    *Trash(trace: Trace) {
        if (this.Field) {
            const revealed_cards = this.Field.GetRevealedCards();
            const armor_card = revealed_cards.find((card) => card.Name === "Magic Ginger");
            if (armor_card) {
                yield trace.Log(`but ${armor_card} is here`);
                return;
            }
        }

        if (this.Element.closest("a-hand")) {
            yield* this.Battle.BroadcastCardMessage(Message.CardLeavesHand, trace, this);
        } else if (this.Element.closest("a-deck")) {
            // yield* this.Battle.BroadcastCardMessage(Message.CardLeavesDeck, trace, this);
        } else if (this.Element.closest("a-location")) {
            yield* this.Battle.BroadcastCardMessage(Message.CardLeavesTable, trace, this);
        } else if (DEBUG) {
            throw `Card ${this} is not in a valid location to be trashed`;
        }

        const trash = this.Owner.Element.querySelector("a-trash")!;
        trash.append(this.Element);
        yield trace.Log(`${this} has been trashed`);

        yield* this.Battle.BroadcastCardMessage(Message.CardEntersTrash, trace, this);

        if (this.Owner === this.Battle.Player) {
            this.Battle.Game.Stats.CardsTrashed++;
        }
    }

    *Move(trace: Trace, target_location: LocationController, actor: ActorController) {
        const source_location = this.Field!;

        yield trace.Log(`${this} moves from ${source_location} to ${target_location} `);
        if (target_location.IsFull(actor)) {
            yield trace.Fork(1).Log(`but ${target_location} is full`);
        } else {
            yield* this.Battle.BroadcastCardMessage(Message.CardMovesFromLocation, trace, this);
            target_location.GetSide(actor).append(this.Element);
            yield* this.Battle.BroadcastCardMessage(Message.CardMovesToLocation, trace, this);
        }

        if (this.Owner === this.Battle.Player) {
            this.Battle.Game.Stats.CardsMoved++;
        }
    }

    *AddToDeck(actor: ActorController, trace: Trace) {
        yield trace.Log(`${actor} shuffle ${this} to deck`);
        this.IsRevealed = false;
        this.TurnPlayed = 0;
        this.Element.classList.remove("frontside");
        let random_child = element(actor.Deck.querySelectorAll("a-card")) ?? null;
        actor.Deck.insertBefore(this.Element, random_child);
        // yield* this.Battle.BroadcastCardMessage(Message.CardEntersDeck, trace, this);
    }

    *AddToHand(actor: ActorController, trace: Trace) {
        yield trace.Log(`${actor} add ${this} to hand`);
        if (actor.Hand.children.length >= 7) {
            yield trace.Fork(1).Log("but the hand is full");
        } else {
            this.IsRevealed = false;
            this.TurnPlayed = 0;
            if (actor.Type === "player") {
                this.Element.draggable = true;
                this.Element.classList.add("frontside");

                if (save_card_state(this, CollectionFlag.Seen)) {
                    yield trace.Fork(1).Log(`you see ${this} for the first time!`);
                }
            } else {
                this.Element.draggable = false;
                this.Element.classList.remove("frontside");
            }
            actor.Hand.append(this.Element);
            yield* this.Battle.BroadcastCardMessage(Message.CardEntersHand, trace, this);
        }
    }

    CanBePlayedHere(location: LocationController) {
        return true;
    }

    Clone() {
        let card = this.Element.cloneNode(true) as CardElement;
        card.setAttribute("type", this.Element.getAttribute("type") || "");
        card.classList.remove("frontside", "unknown", "unowned");
        return card;
    }
}
