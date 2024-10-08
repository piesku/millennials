import {CardController} from "../cards/CardController.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class LoseOnePower extends LocationController {
    Description = "Cards here lose 1 Power each turn.";
    override *OnMessage(kind: Message, trace: Trace, card: CardController) {
        if (kind === Message.TurnEnds) {
            yield trace.Fork(-1).Log(`${this} damages all cards here`);
            for (let card of this.GetRevealedCards()) {
                yield trace.Log(card.AddModifier(this, "addpower", -1));
            }
        }
    }
}
