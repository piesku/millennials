import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Woody extends CardController {
    Name = "Choody";
    Cost = 4;
    Power = 1;
    Description = "Once: Play the top card of your deck here.";
    Sprite = Sprites.Woody;

    override *OnReveal(trace: Trace) {
        let card = this.Owner.Deck.firstElementChild as CardElement;
        if (card) {
            yield trace.Log(`${this} plays ${card.Controller} to ${this.Field}`);
            yield* this.Field!.AddCard(card.Controller, trace.Fork(1), this.Owner);
        }
    }
}
