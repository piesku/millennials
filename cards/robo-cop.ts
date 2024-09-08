import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Robocop extends CardController {
    Name = "Coprobo";
    Cost = 2;
    Power = 3;
    Text = "Once: Draw a card from your opponent's deck";
    Sprite = Sprites.Robocop;

    override *OnReveal(trace: Trace) {
        let deck = this.Opponent.Element.querySelector("a-deck")!;
        yield* this.Owner.DrawCard(trace, deck);
    }
}
