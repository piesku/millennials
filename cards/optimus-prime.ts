import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class OptimusPrime extends CardController {
    Name = "Pessimus";
    Cost = 5;
    Power = 14;
    Text = "Once: Enemy cards here get +2 Power.";
    Sprite = Sprites.OptimusPrime;

    override *OnReveal(trace: Trace) {
        DEBUG: if (!this.Location) {
            throw "OptimusPrime has no location";
        }

        for (let card of this.Location.GetRevealedCards(this.Opponent)) {
            yield trace.log(card.AddModifier(this, "addpower", 2));
        }
    }
}
