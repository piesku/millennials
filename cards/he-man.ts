import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Heman extends CardController {
    Name = "He-Boy";
    Cost = 3;
    Power = 0;
    Description = "Once: Trash your other cards here, gain their Power";
    Sprite = Sprites.HeMan;

    override *OnReveal(trace: Trace) {
        DEBUG: if (!this.Field) {
            throw "He-Man must be in a location";
        }

        for (let card of this.Field.GetRevealedCards(this.Owner)) {
            yield trace.Log(this.AddModifier(this, "addpower", card.CurrentPower));
            yield* card.Trash(trace);
        }
    }
}
