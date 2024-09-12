import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Batman extends CardController {
    Name = "Matban";
    Cost = 1;
    Power = 1;
    Text = "Once: +2 Power to the top card of your deck";
    Sprite = Sprites.Batman;

    override *OnReveal(trace: Trace) {
        if (this.Owner.Deck.firstElementChild) {
            const topCard = this.Owner.Deck.firstElementChild as CardElement;
            yield trace.log(topCard.Instance.AddModifier(this, "addpower", 2));
        }
    }
}
