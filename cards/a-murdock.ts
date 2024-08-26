import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Murdock extends CardController {
    Name = "B-Team Pilot";
    Cost = 1;
    Power = 3;
    Text = "Once: Give all cards in your hand +1 Power";
    Sprite = Sprites.Murdock;

    override *OnReveal(trace: Trace) {
        trace.push(this);

        const hand = this.Owner.Element.querySelector("a-hand")!;
        console.log({hand});
        for (let card of hand.querySelectorAll<CardElement>("a-card")) {
            yield trace.log(`${card.Instance.Name} gets +1 power from ${this.Name}`);
            card.Instance.AddModifier(this, "addpower", 1);
        }
    }
}
