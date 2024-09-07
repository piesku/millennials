import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class JamesBond extends CardController {
    Name = "Bames Jond";
    Cost = 5;
    Power = -8;
    Text = "Once: Switch sides";
    Sprite = Sprites.JamesBond;

    override *OnReveal(trace: Trace) {
        const currentLocation = this.Location!;
        const opponent = this.Opponent;

        yield trace.log(`${this.Name} is switching sides`);

        yield* currentLocation.AddCard(this, trace, opponent, undefined, true);
    }
}
