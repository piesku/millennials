import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class LaraCroft extends CardController {
    Name = "Grave Digger";
    Cost = 4;
    Power = 7;
    Text = "Once: Repeat and trash other Once cards here";
    Sprite = Sprites.LaraCroft;

    override *OnReveal(trace: Trace) {
        DEBUG: if (!this.Location) {
            throw "LaraCroft has no location";
        }

        for (const card of this.Location.GetRevealedCards(this.Owner)) {
            if (!card.Text.startsWith("Once") || trace.includes(card)) {
                continue;
            }

            yield trace.log(`repeating ${card}'s ability`);
            yield* card.OnReveal(trace.fork(card));
            yield* card.Trash(trace);
        }
    }
}
