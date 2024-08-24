import {CardElement} from "../elements/a-card.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Woody extends CardController {
    Name = "Toy Cowboy";
    Cost = 3;
    Power = 4;
    Text = "Add the top card of your deck here.";
    Sprite = Sprites.Woody;

    override *OnReveal() {
        let deck = this.Owner.Element.querySelector("a-deck")!;
        let card = deck.firstElementChild as CardElement;
        if (card) {
            yield `it adds ${card.Instance.Name} to the table`;
            yield* this.Location.AddCard(card.Instance, this.Owner);
        } else {
            yield "but the deck is empty";
        }
    }
}
