import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class OptimusPrime extends CardController {
    Name = "Pessimus";
    Cost = 5;
    Power = 14;
    Description = "Once: +2 Power to opponent cards here";
    Sprite = Sprites.OptimusPrime;

    override *OnReveal(trace: Trace) {
        DEBUG: if (!this.Field) {
            throw "OptimusPrime has no location";
        }

        for (let card of this.Field.GetRevealedCards(this.Opponent)) {
            yield trace.Log(card.AddModifier(this, "addpower", 2));
        }
    }
}
