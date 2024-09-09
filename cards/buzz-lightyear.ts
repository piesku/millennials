import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class BuzzLightyear extends CardController {
    Name = "Toy Astronaut";
    Cost = 1;
    Power = 2;
    Text = "+2 energy next turn";
    Sprite = Sprites.Buzz;

    override *OnMessage(kind: Message, trace: Trace) {
        switch (kind) {
            case Message.TurnStarts:
                if (this.Battle.CurrentTurn === this.TurnPlayed + 1) {
                    this.Owner.CurrentEnergy += 2;
                    this.Owner.Element.Render();
                    yield trace.fork(-1).log(`${this.Owner} gain 2 energy from ${this}`);
                }
                break;
        }
    }
}
