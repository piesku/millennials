import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Pikachu extends CardController {
    Name = "Electric Mouse";
    Cost = 4;
    Power = 3;
    Description = "Once: Trash all opponent 10+ Power cards here";
    Sprite = Sprites.Pikachu;

    override *OnReveal(trace: Trace) {
        const enemyCardsWithMoreThan10Power = this.Field!.GetRevealedCards(this.Opponent).filter(
            (card) => card.CurrentPower >= 10,
        );

        for (const card of enemyCardsWithMoreThan10Power) {
            yield* card.Trash(trace);
        }
    }
}
