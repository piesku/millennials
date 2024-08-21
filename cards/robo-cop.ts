import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

export class Robocop extends CardController {
    Name = "Coprobo";
    Cost = 2;
    Power = 4;
    Text = "Add 1 power to your other cards here";
    Sprite = Sprites.Robocop;

    override *OnReveal() {
        let other_revealed_cards = this.Location.GetRevealedCards(this.Owner.id);
        for (let card of other_revealed_cards) {
            yield `${card.Name} gets +1 power`;
            card.AddModifier(this, "addpower", 1);
        }
    }
}
