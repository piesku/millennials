import {CardController} from "../cards/CardController.js";
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
                    const cards = [];
                    while (!this.IsFull(card.Owner)) {
                        let clone = card.Clone();
                        cards.push(clone);
                        yield* this.AddCard(clone.Instance, trace.fork(), card.Owner, true);
                    }

                    for (let card of cards) {
                        yield* card.Instance.Reveal(trace.fork(card.Instance));
                    }
                    break;
            }
        }
    }
}
