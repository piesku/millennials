import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Faceman extends CardController {
    Name = "B-Team Shitface";
    Cost = 2;
    Power = 4;
    Text = "Once: Add 1 power to your other cards here";
    Sprite = Sprites.Faceman;

    override *OnReveal(trace: Trace) {
        let other_revealed_cards = this.Location!.GetRevealedCards(this.Owner);
        for (let card of other_revealed_cards) {
            yield trace.log(card.AddModifier(this, "addpower", 1));
        }
    }
}
