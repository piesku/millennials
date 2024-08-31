import {CardController} from "../cards/CardController.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class TheEmpireStrikesBack extends LocationController {
    Name = "The Empire Strikes Back";
    Description = "Cards played here get get +2 Power.";
    override *OnMessage(kind: Message, trace: Trace, card: CardController) {
        if (card?.Location === this) {
            switch (kind) {
                case Message.CardEntersTable:
                    card.AddModifier(this, "addpower", 2);
                    yield trace.log(`${card.Name} gets +2 Power from ${this.Name}`);
                    break;
            }
        }
    }
}
