import {CardController} from "../cards/CardController.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class CopyToOpponentHand extends LocationController {
    Name = "CopyToOpponentHand";
    Description = "When you play a card here, add a copy to opponent's hand";
    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Field === this && kind === Message.CardEntersTable) {
            let clone = card.Clone();
            yield* clone.Controller.AddToHand(card.Opponent, trace);
        }
    }
}
