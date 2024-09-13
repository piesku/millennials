import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Heman extends CardController {
    Name = "He-Boy";
    Cost = 3;
    Power = 0;
    Description = "Once: Trash your other cards here, gain their Power";
    Sprite = Sprites.HeMan;

    override *OnReveal(trace: Trace) {
        const otherCards: CardController[] = this.Field?.GetRevealedCards(this.Owner) || [];

        for (let card of otherCards) {
            yield trace.Log(this.AddModifier(this, "addpower", card.CurrentPower));
            yield* card.Trash(trace);
        }
    }
}
