import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Murdock extends CardController {
    Name = "B. Pilot";
    Cost = 1;
    Power = 3;
    Text = "Once: Give all cards in your hand +1 Power";
    Sprite = Sprites.Murdock;

    override *OnReveal(trace: Trace) {
        for (let card of this.Owner.Hand.querySelectorAll<CardElement>("a-card")) {
            yield trace.log(card.Instance.AddModifier(this, "addpower", 1));
        }
    }
}
