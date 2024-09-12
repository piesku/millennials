import {CardElement} from "../elements/a-card.js";
import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class RobinHood extends CardController {
    Name = "Houdini";
    Cost = 4;
    Power = 3;
    Text = "Once: Recycle one of your trashed cards to this location.";
    Sprite = Sprites.RobinHood;
    override SpriteOffset: number = 2;
    override *OnReveal(trace: Trace) {
        let trash = this.Owner.Element.querySelector("a-trash")!;
        let trashed_card = element(trash.querySelectorAll<CardElement>("a-card"));
        if (trashed_card) {
            yield* this.Location!.AddCard(trashed_card.Instance, trace, this.Owner);
        }
    }
}
