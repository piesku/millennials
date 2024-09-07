import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class LuckyLuke extends CardController {
    Name = "Fortunate Lucas";
    Cost = 5;
    Power = 7;
    Text = "Once: Trash the card that costs the least from your opponent's hand";
    Sprite = Sprites.LuckyLuke;

    override *OnReveal(trace: Trace) {
        const opponent = this.Opponent;
        const opponentHand = opponent.Element.querySelectorAll<CardElement>("a-hand a-card");

        if (opponentHand.length === 0) {
            yield trace.log(`Opponent's hand is empty`);
            return;
        }

        let minCostCard = opponentHand[0].Instance;
        for (let cardElement of opponentHand) {
            let card = cardElement.Instance;
            if (card.CurrentCost < minCostCard.CurrentCost) {
                minCostCard = card;
            }
        }

        yield* minCostCard.Trash(trace);
    }
}
