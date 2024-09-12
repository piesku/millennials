import {CardController} from "../cards/CardController.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class ReturnToOwnerHand extends LocationController {
    Name = "ReturnToOwnerHand";
    Description = "When you play a card here, trash it.";
    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Location === this && kind === Message.CardEntersTable) {
            yield* card.Trash(trace);
        }
    }
}
