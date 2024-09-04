import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class ObiWanKenobi extends CardController {
    Name = "Kobi-Two Nierobi";
    Cost = 6;
    Power = 6;
    Text = "Each card you played last turn gains +3 Power";
    Sprite = Sprites.ObiWanKenobi;

    override *OnReveal(trace: Trace) {
        let lastTurn = this.Battle.CurrentTurn - 1;
        let cardsPlayedLastTurn = this.Battle.GetRevealedCards(this.Owner);
        for (let card of cardsPlayedLastTurn) {
            if (card.TurnPlayed !== lastTurn) {
                continue;
            }
            yield trace.log(`${card} gains +3 Power`);
            card.AddModifier(this, "addpower", 3);
        }
    }
}
