import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Leonardo extends CardController {
    Name = "Young Tortoise Beksiński";
    Cost = 3;
    Power = 3;
    Text = "Once: Gain +2 Power for each card you revealed this turn";
    Sprite = Sprites.Leonardo;

    override *OnReveal(trace: Trace) {
        let points = 0;
        for (let card of this.Battle.GetRevealedCards(this.Owner)) {
            if (card.TurnPlayed === this.Battle.CurrentTurn) {
                points += 1;
            }
        }

        yield trace.log(this.AddModifier(this, "addpower", points * 2));
    }
}
