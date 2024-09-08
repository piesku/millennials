import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Woody extends CardController {
    Name = "Toy Cowboy";
    Cost = 4;
    Power = 1;
    Text = "Once: Add the top card of your deck here.";
    Sprite = Sprites.Woody;

    override *OnReveal(trace: Trace) {
        let deck = this.Owner.Element.querySelector("a-deck")!;
        let card = deck.firstElementChild as CardElement;
        if (card) {
            yield trace.log(`${this} plays ${card.Instance} to ${this.Location}`);
            yield* this.Location!.AddCard(card.Instance, trace.fork(1), this.Owner);
        } else {
            yield trace.log("but the deck is empty");
        }
    }
}
