import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Faceman extends CardController {
    Name = "B. Shitface";
    Cost = 2;
    Power = 4;
    Description = "Once: +1 Power to your other cards here";
    Sprite = Sprites.Faceman;

    override *OnReveal(trace: Trace) {
        let other_revealed_cards = this.Field!.GetRevealedCards(this.Owner);
        for (let card of other_revealed_cards) {
            yield trace.Log(card.AddModifier(this, "addpower", 1));
        }
    }
}
