import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Batman extends CardController {
    Name = "Matban";
    Cost = 1;
    Power = 1;
    Text = "Once: Trash card from the top of opponent's deck";
    Sprite = Sprites.Batman;

    override *OnReveal(trace: Trace) {
        const deck = this.Opponent.Element.querySelector("a-deck");
        if (deck && deck.firstElementChild) {
            const topCard = deck.firstElementChild as CardElement;
            yield* topCard.Instance.Trash(trace);
        }
    }
}
