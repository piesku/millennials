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

    override *OnReveal(trace: Trace) {
        let trash = this.Owner.Element.querySelector("a-trash")!;
        const trashed_cards = Array.from(trash.querySelectorAll("a-card")) as CardElement[];
        if (trashed_cards.length === 0) {
            yield trace.log(`No cards in the trash to bring back`);
            return;
        }

        const empty_slots = this.Location!.GetEmptySlots(this.Owner);
        if (empty_slots.length === 0) {
            yield trace.log(`No empty slots available in ${this.Location!.Name}`);
            return;
        }

        const random_trashed_card = element(trashed_cards);
        this.Location!.AddCard(random_trashed_card.Instance, trace, this.Owner);
    }
}
