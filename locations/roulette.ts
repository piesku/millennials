import {CardController} from "../cards/CardController.js";
import {float} from "../lib/random.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class Roulette extends LocationController {
    Name = "Roulette";
    Description = "Cards played here have a 25% chance to be trashed.";
    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Location === this && kind === Message.CardEntersTable) {
            if (float() < 0.25) {
                yield* card.Trash(trace);
            } else {
                yield trace.log(`${card} survives`);
            }
        }
    }
}
