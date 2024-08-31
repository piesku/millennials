import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Raphael extends CardController {
    Name = "Young Tortoise Monet";
    Cost = 3;
    Power = 5;
    Text = "Once: Move an enemy 1 or 2-Cost card to this location.";
    Sprite = Sprites.Raphael;

    override *OnReveal(trace: Trace) {
        const enemy_cards = this.Battle.GetRevealedCards(this.Opponent).filter(
            (card) => [1, 2].includes(card.CurrentCost) && card.Location !== this.Location,
        );

        if (enemy_cards.length === 0) {
            yield trace.log("but there are no cards to move");
            return;
        }

        const empty_slots = this.Location!.GetEmptySlots(this.Opponent);
        if (empty_slots.length === 0) {
            yield trace.log("but there are no empty slots");
            return;
        }

        const card_to_move = element(enemy_cards);
        const radom_slot = element(empty_slots);

        yield* card_to_move.Move(trace, radom_slot);
    }
}
