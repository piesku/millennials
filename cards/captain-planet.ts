import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class CaptainPlaner extends CardController {
    Name = "Inspector Earth";
    Cost = 4;
    Power = 4;
    Text = "Once: Duplicate your hand";
    Sprite = Sprites.CaptainPlanet;

    override *OnReveal(trace: Trace) {
        const hand = this.Owner.Hand;
        const cardsInHand = Array.from(hand.children) as CardElement[];

        for (const card of cardsInHand) {
            let clone = card.Instance.Clone();
            yield* clone.Instance.AddToHand(card.Instance.Owner, trace);
        }
    }
}
