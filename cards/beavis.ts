import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Beavis extends CardController {
    Name = "Bobby";
    Cost = 1;
    Power = 2;
    Description = "Once: Trash the top card from the opponent's deck";
    Sprite = Sprites.Beavis;

    override *OnReveal(trace: Trace) {
        if (this.Opponent.Deck.firstElementChild) {
            const top_card = this.Opponent.Deck.firstElementChild as CardElement;
            yield* top_card.Controller.Trash(trace);
        }
    }
}
