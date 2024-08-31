import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class MichaelAngelo extends CardController {
    Name = "Young Tortoise Van Gogh";
    Cost = 3;
    Power = 3;
    Text = "Destroy all cards costing 1";
    Sprite = Sprites.MichaelAngelo;

    override *OnReveal(trace: Trace) {
        const all_revealed_cards = [
            ...this.Battle.GetRevealedCards(this.Owner),
            ...this.Battle.GetRevealedCards(this.Opponent),
        ];
        for (let card of all_revealed_cards) {
            if (card.CurrentCost === 1) {
                yield* card.Trash(trace.fork());
            }
        }
    }
}
