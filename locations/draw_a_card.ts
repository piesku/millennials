import {CardController} from "../cards/CardController.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class DrawACard extends LocationController {
    Description = "When you play a card here, draw a card.";
    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Field === this) {
            switch (kind) {
                case Message.CardEntersTable:
                    yield* card!.Owner.DrawCard(trace);
                    break;
            }
        }
    }
}
