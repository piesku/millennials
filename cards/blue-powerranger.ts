import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class BluePowerRanger extends CardController {
    Name = "Blue Guardian";
    Cost = 2;
    Power = 3;
    Text = "Once: Clone this into your hand";
    Sprite = Sprites.BluePowerRanger;

    override *OnReveal(trace: Trace) {
        const clone = this.Clone();
        yield* clone.Instance.AddToHand(this.Owner, trace);
    }
}
