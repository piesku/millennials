import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Leonardo extends CardController {
    Name = "Da Vinci";
    Cost = 3;
    Power = 3;
    Description = "Once: +2 Power for each card you revealed this turn";
    Sprite = Sprites.Leonardo;

    override *OnReveal(trace: Trace) {
        for (let card of this.Battle.GetRevealedCards(this.Owner)) {
            if (card.TurnPlayed === this.Battle.CurrentTurn) {
                yield trace.Log(this.AddModifier(this, "addpower", 2));
            }
        }
    }
}
