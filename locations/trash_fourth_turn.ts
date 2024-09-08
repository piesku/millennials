import {CardController} from "../cards/CardController.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class TrashFourthTurn extends LocationController {
    Name = "TrashFourthTurn";
    Description = "At the end of turn 4, trash all cards here.";
    override *OnMessage(kind: Message, trace: Trace, card: CardController) {
        if (kind === Message.TurnEnds && this.Battle.CurrentTurn === 4) {
            yield trace.fork(-1).log(`${this} trashes all cards here`);
            for (let card of this.GetRevealedCards()) {
                yield* card.Trash(trace);
            }
        }
    }
}
