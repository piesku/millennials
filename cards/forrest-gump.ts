import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class ForrestGump extends CardController {
    Name = "Gorrest Fump";
    Cost = 1;
    Power = 2;
    Text = "Once: The last card you played moves to radom slot in this location";
    Sprite = Sprites.ForrestGump;

    override *OnReveal(trace: Trace) {
        trace.push(this);

        const played_cards = this.Battle.PlayedCardsQueue;
        let last_played_card = null;

        for (let i = played_cards.length - 1; i >= 0; i--) {
            if (played_cards[i] !== this && played_cards[i].Owner === this.Owner) {
                last_played_card = played_cards[i];
                break;
            }
        }

        if (last_played_card) {
            const empty_slots = this.Location!.GetEmptySlots(this.Owner);
            if (empty_slots.length === 0) {
                yield trace.log(`No empty slots available in ${this.Location!.Name}`);
                return;
            }
            const radom_slot = element(empty_slots);

            if (radom_slot) {
                yield* last_played_card.Move(trace, radom_slot);
                yield trace.log(`${last_played_card.Name} moves to ${this.Location!.Name}`);
            }
        } else {
            yield trace.log(`No cards were played before ${this.Name}`);
            return;
        }
    }
}
