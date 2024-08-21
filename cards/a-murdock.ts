import {CardController} from "../controllers/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {Sprites} from "../sprites/sprites.js";

export class Murdock extends CardController {
    Name = "B-Team Pilot";
    Cost = 1;
    Power = 3;
    Text = "Once: Give all cards in your hand +1 Power";
    Sprite = Sprites.Murdock;

    override *OnReveal() {
        const hand = this.Owner.querySelector("a-hand")!;
        console.log({hand});
        for (let card of hand.querySelectorAll<CardElement>("a-card")) {
            yield `${card.Instance.Name} gets +1 power from ${this.Name}`;
            card.Instance.AddModifier(this, "addpower", 1);
        }
    }
}
