import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Woody extends CardController {
    Name = "Toy Cowboy";
    Cost = 3;
    Power = 4;
    Text = "Add the top card of your deck here.";
    Sprite = Sprites.Woody;

    override *OnReveal(trace: Trace) {
        let deck = this.Owner.Element.querySelector("a-deck")!;
        let card = deck.firstElementChild as CardElement;
        if (card) {
            yield trace.log(`${this.Name} adds ${card.Instance} to the table`);
            yield* this.Location!.AddCard(card.Instance, trace, this.Owner);
        } else {
            yield trace.log("but the deck is empty");
        }
    }
}
