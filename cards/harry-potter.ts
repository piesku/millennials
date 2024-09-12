import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class HarryPotter extends CardController {
    Name = "Parry Hotter";
    Cost = 2;
    Power = 4;
    Text = "Once: All cards in your deck have 4 Power";
    Sprite = Sprites.HarryPotter;

    override *OnReveal(trace: Trace): Generator<[Trace, string], void> {
        for (let card of this.Owner.Deck.querySelectorAll<CardElement>("a-card")) {
            yield trace.log(card.Instance.AddModifier(this, "setpower", 4));
        }
    }
}
