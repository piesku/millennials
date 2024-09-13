import {CardController} from "../cards/CardController.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class LoseOnePower extends LocationController {
    Name = "LoseOnePower";
    Description = "Cards here lose 1 Power each turn.";
    override *OnMessage(kind: Message, trace: Trace, card: CardController) {
        if (kind === Message.TurnEnds) {
            yield trace.fork(-1).log(`${this} damages all cards here`);
            for (let card of this.GetRevealedCards()) {
                yield trace.log(card.AddModifier(this, "addpower", -1));
            }
        }
    }
}
