import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class OptimusPrime extends CardController {
    Name = "Pessimus Dime";
    Cost = 5;
    Power = 14;
    Text = "Once: Enemy cards here get +2 Power.";
    Sprite = Sprites.OptimusPrime;

    override *OnReveal(trace: Trace) {
        const enemyCards = this.Location!.GetRevealedCards(this.Opponent);
        if (enemyCards.length === 0) {
            yield trace.log(`No enemy cards found at ${this.Location}`);
            return;
        }

        for (let card of enemyCards) {
            yield trace.log(card.AddModifier(this, "addpower", 2));
        }
    }
}
