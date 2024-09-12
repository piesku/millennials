import {CardElement} from "../elements/a-card.js";
import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class RobinHood extends CardController {
    Name = "Hobin Rood";
    Cost = 4;
    Power = 3;
    Text = "Once: Bring back one of your trashed cards to this location.";
    Sprite = Sprites.RobinHood;
    override SpriteOffset: number = 2;
    override *OnReveal(trace: Trace) {
        let trash = this.Owner.Element.querySelector("a-trash")!;
        let trashed_cards = Array.from(trash.querySelectorAll("a-card")) as CardElement[];
        let trashed_card = element(trashed_cards);
        if (!trashed_card) {
            yield trace.log(`no cards in the trash to bring back`);
        } else {
            yield* this.Location!.AddCard(trashed_card.Instance, trace, this.Owner);
        }
    }
}
