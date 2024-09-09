import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class MichaelAngelo extends CardController {
    Name = "Van Gogh";
    Cost = 3;
    Power = 3;
    Text = "Once: Destroy all cards costing 1";
    Sprite = Sprites.MichaelAngelo;

    override *OnReveal(trace: Trace) {
        for (let card of this.Battle.GetRevealedCards()) {
            if (card.CurrentCost === 1) {
                yield* card.Trash(trace.fork());
            }
        }
    }
}
