import {CardController} from "../controllers/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {Sprites} from "../sprites/sprites.js";

export class Blade extends CardController {
    Name = "Spike";
    Cost = 1;
    Power = 2;
    Text = "Once: Give the top card of your deck +2 power";
    Sprite = Sprites.Blade;

    override *OnReveal() {
        const deck = this.Owner.Element.querySelector("a-deck");
        if (deck && deck.firstElementChild) {
            const topCard = deck.firstElementChild as CardElement;
            yield `${topCard.Instance.Name} gets +2 power from ${this.Name}`;
            topCard.Instance.AddModifier(this, "addpower", 2);
        }
    }
}
