import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class LaraCroft extends CardController {
    Name = "Grave Driver";
    Cost = 4;
    Power = 7;
    Text = "Once: Repeat the Once abilities of your other cards here, then trash them";
    Sprite = Sprites.LaraCroft;

    override *OnReveal(trace: Trace) {
        const cardsToRepeat = this.Location?.GetRevealedCards(this.Owner) || [];
        for (const card of cardsToRepeat) {
            if (!card.Text.startsWith("Once")) {
                continue;
            }

            yield trace.log(`Repeating Once ability of ${card.Name}`);
            const _trace = trace.fork();
            _trace.push(card);
            yield* card.OnReveal(_trace);
            yield* card.Trash(trace);
        }
    }
}
