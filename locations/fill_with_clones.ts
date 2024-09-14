import {CardController} from "../cards/CardController.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class FillWithClones extends LocationController {
    Description = "Cards played here fill the location with their copies.";
    override *OnMessage(kind: Message, trace: Trace, card: CardController) {
        if (card?.Field === this) {
            switch (kind) {
                case Message.CardEntersTable:
                    yield trace.Log(`${this} fills with clones of ${card}`);
                    const cards = [];
                    while (!this.IsFull(card.Owner)) {
                        let clone = card.Clone();
                        cards.push(clone);
                        yield* this.AddCard(clone.Controller, trace, card.Owner, true);
                    }

                    for (let card of cards) {
                        yield* card.Controller.Reveal(trace);
                    }
                    break;
            }
        }
    }
}
