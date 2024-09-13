import {CardElement} from "../elements/a-card.js";
import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class GiveCostHand extends LocationController {
    Name = "GiveCostHand";
    Description = "Give +$1 cost to a random card in each player's hand.";
    override *OnReveal(trace: Trace) {
        {
            let random_card = element(this.Battle.Player.Hand.querySelectorAll<CardElement>("a-card"));
            if (random_card) {
                yield trace.Log(random_card.Controller.AddModifier(this, "addcost", 1));
            }
        }
        {
            let random_card = element(this.Battle.Villain.Hand.querySelectorAll<CardElement>("a-card"));
            if (random_card) {
                yield trace.Log(random_card.Controller.AddModifier(this, "addcost", 1));
            }
        }
    }
}
