import {CardController} from "../cards/CardController.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class GainTwoPower extends LocationController {
    Description = "Cards played here get +2 Power.";
    override *OnMessage(kind: Message, trace: Trace, card: CardController) {
        if (card?.Field === this) {
            switch (kind) {
                case Message.CardEntersTable:
                    yield trace.Log(card.AddModifier(this, "addpower", 2));
                    break;
            }
        }
    }
}
