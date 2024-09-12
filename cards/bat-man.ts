import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Batman extends CardController {
    Name = "Matban";
    Cost = 1;
    Power = 1;
    Text = "Once: Trash top card from the opponent's deck";
    Sprite = Sprites.Batman;

    override *OnReveal(trace: Trace) {
        if (this.Opponent.Deck.firstElementChild) {
            const top_card = this.Opponent.Deck.firstElementChild as CardElement;
            yield* top_card.Instance.Trash(trace);
        }
    }
}
