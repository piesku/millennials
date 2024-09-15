import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class LaraCroft extends CardController {
    Name = "Grave Digger";
    Cost = 4;
    Power = 7;
    Description = "Once: Repeat and trash other Once cards here";
    Sprite = Sprites.LaraCroft;

    override *OnReveal(trace: Trace) {
        DEBUG: if (!this.Field) {
            throw "LaraCroft has no location";
        }

        for (const card of this.Field.GetRevealedCards(this.Owner)) {
            if (!card.Description.startsWith("Once") || trace.includes(card)) {
                continue;
            }

            yield trace.Log(`repeating ${card}'s ability`);
            yield* card.Reveal(trace);
            yield* card.Trash(trace);
        }
    }
}
