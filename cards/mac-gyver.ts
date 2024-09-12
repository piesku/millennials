import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class MacGyver extends CardController {
    Name = "GacMyver";
    Cost = 6;
    Power = 8;
    Description = "Once: Repeat the Once abilities of all your revealed cards";
    Sprite = Sprites.MacGyver;

    override *OnReveal(trace: Trace) {
        for (const card of this.Battle.GetRevealedCards(this.Owner)) {
            if (!card.Description.startsWith("Once") || trace.includes(card)) {
                continue;
            }

            yield trace.log(`${this} repeats ${card}'s ability`);
            yield* card.OnReveal(trace.fork(card));
        }
    }
}
