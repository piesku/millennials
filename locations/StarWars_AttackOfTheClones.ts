import {CardController} from "../cards/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class AttackOfTheClones extends LocationController {
    Name = "Attack of the Clones";
    Description = "Cards played here fill the location with their copies.";
    override *OnMessage(kind: Message, trace: Trace, card: CardController) {
        if (card?.Location === this) {
            switch (kind) {
                case Message.CardEntersTable:
                    yield trace.log(`${this.Name} fills with clones of ${card}`);
                    while (!this.IsFull(card.Owner)) {
                        let clone = document.createElement("a-card") as CardElement;
                        clone.setAttribute("type", card.Element.getAttribute("type")!);
                        yield* this.AddCard(clone.Instance, trace.fork(1), card.Owner);
                    }
                    break;
            }
        }
    }
}
