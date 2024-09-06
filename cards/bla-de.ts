import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Blade extends CardController {
    Name = "Spike";
    Cost = 1;
    Power = 2;
    Text = "Once: Give the top card of your deck +2 power";
    Sprite = Sprites.Blade;

    override *OnReveal(trace: Trace) {
        const deck = this.Owner.Element.querySelector("a-deck");
        if (deck && deck.firstElementChild) {
            const topCard = deck.firstElementChild as CardElement;
            yield trace.log(topCard.Instance.AddModifier(this, "addpower", 2));
        }
    }
}
