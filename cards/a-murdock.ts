import {CardController} from "../controllers/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "a-murdock",
    class extends CardController {
        Name = "B-Team Pilot";
        Cost = 1;
        Power = 3;
        Text = "Once: Give all cards in your hand +1 Power";
        Sprite = Sprites.Murdock;

        override *OnReveal() {
            const hand = this.Owner.querySelector("a-hand")!;
            console.log({hand});
            for (let card_el of hand.querySelectorAll<CardElement>("a-card")) {
                const card = card_el.Controller;
                yield `${card.Name} gets +1 power from ${this.Name}`;
                card.AddModifier(this, "addpower", 1);
            }
        }
    },
);
