import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Superman extends CardController {
    Name = "Mupersan";
    Cost = 5;
    Power = 8;
    Description = "Once: -1 Power to all opponents cards here";
    Sprite = Sprites.Superman;

    override *OnReveal(trace: Trace) {
        for (let card of this.Field!.GetRevealedCards(this.Opponent)) {
            yield trace.Log(card.AddModifier(this, "addpower", -1));
        }
    }
}
