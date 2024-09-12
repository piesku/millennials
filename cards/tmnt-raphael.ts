import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Raphael extends CardController {
    Name = "Santi";
    Cost = 3;
    Power = 5;
    Text = "Once: Move an enemy 1 or 2-Cost card to this location.";
    Sprite = Sprites.Raphael;

    override *OnReveal(trace: Trace) {
        const enemy_cards = this.Battle.GetRevealedCards(this.Opponent).filter(
            (card) => [1, 2].includes(card.CurrentCost) && card.Location !== this.Location,
        );

        let card_to_move = element(enemy_cards);
        if (card_to_move) {
            yield* card_to_move.Move(trace, this.Location!, this.Owner);
        }
    }
}
