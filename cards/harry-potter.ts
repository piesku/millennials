import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class HarryPotter extends CardController {
    Name = "Parry Hotter";
    Cost = 2;
    Power = 4;
    Text = "Once: Set the Power of all cards in your deck to 4";
    Sprite = Sprites.HarryPotter;

    override *OnReveal(trace: Trace): Generator<[Trace, string], void> {
        const deck = this.Owner.Deck;
        for (let card of deck.querySelectorAll<CardElement>("a-card")) {
            yield trace.log(card.Instance.AddModifier(this, "setpower", 4));
        }
    }
}
