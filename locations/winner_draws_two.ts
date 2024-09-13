import {CardController} from "../cards/CardController.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class WinnerDrawsTwo extends LocationController {
    Description = "After turn 4, whoever is winning here draws 2 cards.";
    override *OnMessage(kind: Message, trace: Trace, card: CardController) {
        if (kind === Message.TurnEnds && this.Battle.CurrentTurn === 4) {
            if (this.GetScore(this.Battle.Player) > this.GetScore(this.Battle.Villain)) {
                yield trace.Fork(-1).Log(`${this.Battle.Player} are winning at ${this}`);
                yield* this.Battle.Player.DrawCard(trace);
                yield* this.Battle.Player.DrawCard(trace);
            } else if (this.GetScore(this.Battle.Player) < this.GetScore(this.Battle.Villain)) {
                yield trace.Fork(-1).Log(`${this.Battle.Villain} are winning at ${this}`);
                yield* this.Battle.Villain.DrawCard(trace);
                yield* this.Battle.Villain.DrawCard(trace);
            }
        }
    }
}
