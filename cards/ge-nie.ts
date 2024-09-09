import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Genie extends CardController {
    Name = "Djin";
    Cost = 6;
    Power = 0;
    Text = "Once: Trash one of your other cards here to copy it at the other locations.";
    Sprite = Sprites.Genie;

    override *OnReveal(trace: Trace) {
        DEBUG: if (!this.Location) {
            throw "Genie has no location";
        }

        let cards_here = this.Location.GetRevealedCards(this.Owner);
        let card = element(cards_here);
        if (card) {
            yield* card.Trash(trace);

            for (let other_location of this.Battle.Locations) {
                if (other_location !== this.Location) {
                    let clone = card.Clone();
                    yield* other_location.AddCard(clone.Instance, trace.fork(1), this.Owner);
                }
            }
        }
    }
}
