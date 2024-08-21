import {CardController} from "../controllers/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {Sprites} from "../sprites/sprites.js";

export class Batman extends CardController {
    Name = "Matban";
    Cost = 1;
    Power = 1;
    Text = "Once: Trash card from the top of opponent's deck";
    Sprite = Sprites.Batman;

    override *OnReveal(): Generator<string, void> {
        const opponentDeck = this.Rival.Element.querySelector("a-deck");
        if (opponentDeck && opponentDeck.firstElementChild) {
            const topCard = opponentDeck.firstElementChild as CardElement;
            yield* topCard.Instance.Trash();
            yield `${topCard.Instance.Name} has been trashed from the top of the opponent's deck`;
        } else {
            yield `No card found on the top of the opponent's deck to trash`;
        }
    }
}
