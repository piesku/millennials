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
        const opponentDeck = this.Opponent.Element.querySelector("a-deck");
        if (opponentDeck && opponentDeck.firstElementChild) {
            const topCard = opponentDeck.firstElementChild as CardElement;
            yield* topCard.Instance.Trash(trace);
            yield trace.log(`${topCard.Instance.Name} has been trashed from the top of the opponent's deck`);
        } else {
            yield trace.log(`No card found on the top of the opponent's deck to trash`);
        }
    }
}
