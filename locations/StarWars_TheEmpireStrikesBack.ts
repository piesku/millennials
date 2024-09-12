import {CardController} from "../cards/CardController.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class TheEmpireStrikesBack extends LocationController {
    Name = "The Empire Strikes Back";
    Description = "Cards played here get +2 Power.";
    override *OnMessage(kind: Message, trace: Trace, card: CardController) {
        if (card?.Field === this) {
            switch (kind) {
                case Message.CardEntersTable:
                    yield trace.log(card.AddModifier(this, "addpower", 2));
                    break;
            }
        }
    }
}
