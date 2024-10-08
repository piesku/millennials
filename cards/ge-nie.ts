import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Genie extends CardController {
    Name = "Dijon";
    Cost = 6;
    Power = 0;
    Description = "Once: Trash a card here to copy it at the other locations";
    Sprite = Sprites.Genie;

    override *OnReveal(trace: Trace) {
        DEBUG: if (!this.Field) {
            throw "Genie has no location";
        }

        let cards_here = [...this.Field.GetRevealedCards(this.Owner)];
        let card = element(cards_here);
        if (card) {
            yield* card.Trash(trace);

            for (let other_location of this.Battle.Locations) {
                if (other_location !== this.Field) {
                    let clone = card.Clone();
                    yield* other_location.AddCard(clone.Controller, trace.Fork(1), this.Owner);
                }
            }
        }
    }
}
