import {CardElement} from "../elements/a-card.js";
import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class TrashFromHand extends LocationController {
    Name = "TrashFromHand";
    Description = "Trash a card from each player's hand.";
    override *OnReveal(trace: Trace) {
        {
            let random_card = element(this.Battle.Player.Hand.querySelectorAll<CardElement>("a-card"));
            if (random_card) {
                yield* random_card.Instance.Trash(trace);
            }
        }
        {
            let random_card = element(this.Battle.Villain.Hand.querySelectorAll<CardElement>("a-card"));
            if (random_card) {
                yield* random_card.Instance.Trash(trace);
            }
        }
    }
}
