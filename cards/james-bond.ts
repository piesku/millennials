import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class JamesBond extends CardController {
    Name = "Bames Jond";
    Cost = 5;
    Power = -8;
    Description = "Once: Switch sides";
    Sprite = Sprites.JamesBond;

    override *OnReveal(trace: Trace) {
        yield* this.Move(trace, this.Field!, this.Opponent);
    }
}
