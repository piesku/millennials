import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Superman extends CardController {
    Name = "Mupersan";
    Cost = 5;
    Power = 8;
    Text = "Once: All opponents cards here -1 Power";
    Sprite = Sprites.Superman;

    override *OnReveal(trace: Trace) {
        for (let card of this.Location!.GetRevealedCards(this.Opponent)) {
            yield trace.log(card.AddModifier(this, "addpower", -1));
        }
    }
}
