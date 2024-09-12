import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Woody extends CardController {
    Name = "Choody";
    Cost = 4;
    Power = 1;
    Text = "Once: Play the top card of your deck here.";
    Sprite = Sprites.Woody;

    override *OnReveal(trace: Trace) {
        let card = this.Owner.Deck.firstElementChild as CardElement;
        if (card) {
            yield trace.log(`${this} plays ${card.Instance} to ${this.Location}`);
            yield* this.Location!.AddCard(card.Instance, trace.fork(1), this.Owner);
        }
    }
}
