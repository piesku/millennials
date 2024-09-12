import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class CaptainPlaner extends CardController {
    Name = "Captain Planer";
    Cost = 4;
    Power = 4;
    Text = "Once: Duplicate your hand";
    Sprite = Sprites.CaptainPlanet;

    override *OnReveal(trace: Trace) {
        for (const card of this.Owner.Hand.querySelectorAll<CardElement>("a-card")) {
            let clone = card.Instance.Clone();
            yield* clone.Instance.AddToHand(card.Instance.Owner, trace);
        }
    }
}
