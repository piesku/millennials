import {CardController} from "../cards/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class AttackOfTheClones extends LocationController {
    Name = "Attack of the Clones";
    Description = "Cards played here fill the location with their copies.";
    override *OnMessage(kind: Message, trace: Trace, card: CardController) {
        trace.push(this);

        if (card?.Location === this) {
            switch (kind) {
                case Message.CardEntersTable:
                    let empty_slots = this.GetEmptySlots(card.Owner);
                    if (empty_slots.length === 0) {
                        yield trace.log(`but ${this.Name} is full`);
                        break;
                    }
                    yield trace.log(`${this.Name} fills with clones of ${card.Name}`);
                    for (let slot of empty_slots) {
                        let clone = document.createElement("a-card") as CardElement;
                        clone.setAttribute("type", card.Element.getAttribute("type")!);
                        let slot_index = Array.from(slot.parentElement!.children).indexOf(slot);
                        yield* this.AddCard(clone.Instance, trace.fork(1), card.Owner, slot_index);
                    }
                    break;
            }
        }
    }
}
