import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Pikachu extends CardController {
    Name = "Electric Mouse";
    Cost = 4;
    Power = 3;
    Text = "Once: Trash all enemy cards here that have 10 or more Power.";
    Sprite = Sprites.Pikachu;

    override *OnReveal(trace: Trace) {
        const enemyCardsWithMoreThan10Power = this.Location!.GetRevealedCards(this.Opponent).filter(
            (card) => card.CurrentPower >= 10,
        );

        for (const card of enemyCardsWithMoreThan10Power) {
            yield trace.log(`Trashing ${card} because it has ${card.CurrentPower} Power`);
            yield* card.Trash(trace);
        }
    }
}
