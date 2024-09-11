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
    abstract Text: string;
    abstract Sprite: Sprites;

    Id = next_id();
    IsVillain = false;
    IsRevealed = false;
    TurnPlayed = 0;

    HasDynamicCost = false;

    DynamicCost() {}

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
            return actor.Instance;
        } else {
            let actor_element = this.Element.closest("a-actor") as ActorElement;
            return actor_element.Instance;
        }
    }

    get Opponent(): ActorController {
        let actor_id = this.Owner.Type === "player" ? "villain" : "player";
        let actor = this.Battle.querySelector("#" + actor_id) as ActorElement;
        return actor.Instance;
    }

    get Battle(): BattleScene {
        return this.Element.closest<BattleScene>("battle-scene")!;
    }

    get Location(): LocationController | undefined {
        let location = this.Element.closest<LocationElement>("a-location");
        return location?.Instance;
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

        switch (op) {
            case "addpower":
            case "addcost": {
                let amount = value > 0 ? "+" + value : value;
                return `${this} gains ${amount} ${op.slice(3)}${origin === this ? "" : ` from ${origin}`}`;
            }
            case "setpower":
            case "setcost": {
                return `${this} has ${value} ${op.slice(3)}${origin === this ? "" : ` from ${origin}`}`;
            }
            default:
                return `${this} gains a modifier from ${origin}`;
        }
    }

    RemoveModifiers(origin: CardController | LocationController) {
        const modifiers = this.Element.querySelectorAll(`a-modifier[origin-id="${origin.Id}"]`);
        for (let modifier of modifiers) {
            this.Element.removeChild(modifier);
        }
        this.Element.Render();
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
        DEBUG: if (!this.Location) {
            throw `${this} must be in a location to be revealed`;
        }
        if (trace.length === 0) {
            yield trace.log(`${this.Owner} reveal ${this} in ${this.Location}`);
        }
        this.Element.classList.add("frontside");
        if (!this.Location.IsRevealed || this.Location.CanOnRevealHere(this)) {
            yield* this.OnReveal(trace.fork(this));
        }
        this.IsRevealed = true;
        this.TurnPlayed = this.Battle.CurrentTurn;

        // Update the collection state.
        if (save_card_state(this, CollectionFlag.Seen)) {
            yield trace.fork(1).log(`you see ${this} for the first time!`);
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
        if (this.Element.closest("a-hand")) {
            yield* this.Battle.BroadcastCardMessage(Message.CardLeavesHand, trace, this);
        } else if (this.Element.closest("a-deck")) {
            yield* this.Battle.BroadcastCardMessage(Message.CardLeavesDeck, trace, this);
        } else if (this.Element.closest("a-location")) {
            yield* this.Battle.BroadcastCardMessage(Message.CardLeavesTable, trace, this);
        } else if (DEBUG) {
            throw `Card ${this} is not in a valid location to be trashed`;
        }

        const trash = this.Owner.Element.querySelector("a-trash")!;
        trash.append(this.Element);
        yield trace.log(`${this} has been trashed`);

        yield* this.Battle.BroadcastCardMessage(Message.CardEntersTrash, trace, this);

        if (this.Owner === this.Battle.Player) {
            this.Battle.Game.Stats.CardsTrashed++;
        }
    }

    *Move(trace: Trace, target_location: LocationController, actor: ActorController) {
        const source_location = this.Location!;

        yield trace.log(`${this} moves from ${source_location} to ${target_location} `);
        if (target_location.IsFull(actor)) {
            yield trace.fork(1).log(`but ${target_location} is full`);
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
        yield trace.log(`${actor} shuffle ${this} to deck`);
        this.IsRevealed = false;
        this.TurnPlayed = 0;
        this.Element.classList.remove("frontside");
        let random_child = element(actor.Deck.querySelectorAll("a-card")) ?? null;
        actor.Deck.insertBefore(this.Element, random_child);
        yield* this.Battle.BroadcastCardMessage(Message.CardEntersDeck, trace, this);
    }

    *AddToHand(actor: ActorController, trace: Trace) {
        yield trace.log(`${actor} add ${this} to hand`);
        if (actor.Hand.children.length >= 7) {
            yield trace.fork(1).log("but the hand is full");
        } else {
            this.IsRevealed = false;
            this.TurnPlayed = 0;
            this.Element.classList.remove("frontside");
            actor.Hand.append(this.Element);
            yield* this.Battle.BroadcastCardMessage(Message.CardEntersHand, trace, this);
        }
    }

    *ReturnToOwnerHand(trace: Trace) {
        yield trace.log(`${this} returns to the owner's hand`);
        if (this.Owner.Hand.children.length >= 7) {
            yield trace.fork(1).log("but the hand is full");
        } else {
            yield* this.Battle.BroadcastCardMessage(Message.CardLeavesTable, trace, this);
            this.IsRevealed = false;
            this.TurnPlayed = 0;
            this.Element.classList.remove("frontside");
            this.Owner.Hand.append(this.Element);
            this.Battle.PlayedCardsQueue.splice(this.Battle.PlayedCardsQueue.indexOf(this), 1);
            yield* this.Battle.BroadcastCardMessage(Message.CardEntersHand, trace, this);
        }
    }

    CanBePlayedHere(location: LocationController) {
        return true;
    }

    Clone() {
        let card = this.Element.cloneNode(true) as CardElement;
        card.setAttribute("type", this.Element.getAttribute("type") || "");
        card.classList.add("frontside");
        return card;
    }
}
