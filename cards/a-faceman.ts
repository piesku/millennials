import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Faceman extends CardController {
    Name = "B-Team Shitface";
    Cost = 2;
    Power = 3;
    Text = "Draw a card from your opponent's deck";
    Sprite = Sprites.Faceman;

    override *OnReveal(trace: Trace) {
        let deck = this.Opponent.Element.querySelector("a-deck")!;
        yield* this.Owner.DrawCard(trace, deck);
    }
}
