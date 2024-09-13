import {CardController} from "../cards/CardController.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class ReturnToOwnerHand extends LocationController {
    Description = "When you play a card here, trash it.";
    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Field === this && kind === Message.CardEntersTable) {
            yield* card.Trash(trace);
        }
    }
}
