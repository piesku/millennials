import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Heman extends CardController {
    Name = "HeBoy";
    Cost = 3;
    Power = 0;
    Text = "Once: Trash your other cards here, add their Power to this";
    Sprite = Sprites.HeMan;

    override *OnReveal(trace: Trace) {
        const otherCards: CardController[] = this.Location?.GetRevealedCards(this.Owner) || [];
        let totalPower = 0;

        for (let card of otherCards) {
            totalPower += card.Power;
            yield* card.Trash(trace);
        }

        yield trace.log(this.AddModifier(this, "addpower", totalPower));
    }
}
