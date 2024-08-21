import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "bla-de",
    class extends CardController {
        Name = "Spike";
        Cost = 1;
        Power = 2;
        Text = "Once: Give the top card of your deck +2 power";
        Sprite = Sprites.Blade;

        override *OnReveal() {
            const deck = this.Owner.querySelector("a-deck");
            if (deck && deck.firstElementChild) {
                const topCard = deck.firstElementChild as CardController;
                yield `${topCard.Name} gets +2 power from ${this.Name}`;
                topCard.AddModifier(this, "addpower", 2);
            }
        }
    },
);
