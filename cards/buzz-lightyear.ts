import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class BuzzLightyear extends CardController {
    Name = "Toy Astronaut";
    Cost = 1;
    Power = 2;
    // TODO This should be a Once, but since it's implemented as a TurnStarts, it won't work with MacGyver.
    Description = "+2 Energy next turn";
    Sprite = Sprites.Buzz;

    override *OnMessage(kind: Message, trace: Trace) {
        switch (kind) {
            case Message.TurnStarts:
                if (this.Battle.CurrentTurn === this.TurnPlayed + 1) {
                    this.Owner.CurrentEnergy += 2;
                    this.Owner.Element.Render();
                    yield trace.Fork(-1).Log(`${this.Owner} gain 2 Energy from ${this}`);
                }
                break;
        }
    }
}
