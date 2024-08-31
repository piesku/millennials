import {CardController} from "../cards/CardController.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class ANewHope extends LocationController {
    Name = "A New Hope";
    Description = "When you play a card here, draw a card.";
    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Location === this) {
            switch (kind) {
                case Message.CardEntersTable:
                    yield* card!.Owner.DrawCard(trace);
                    break;
            }
        }
    }
}
