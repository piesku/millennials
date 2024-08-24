import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Faceman extends CardController {
    Name = "B-Team Shitface";
    Cost = 2;
    Power = 3;
    Text = "Draw a card from your rival's deck";
    Sprite = Sprites.Faceman;

    override *OnReveal() {
        let rival_deck = this.Rival.Element.querySelector("a-deck")!;
        yield `${this.Owner.Name} draws a card from ${this.Rival.Name}'s deck`;
        yield* this.Owner.DrawCard(rival_deck);
    }
}
