import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class HarryPotter extends CardController {
    Name = "Parry Hotter";
    Cost = 2;
    Power = 2;
    Text = "If both sides here are full, +6 power";
    Sprite = Sprites.HarryPotter;

    override *OnMessage(kind: Message, trace: Trace) {
        trace.push(this);

        switch (kind) {
            case Message.TurnStarts:
                if (this.Battle.CurrentTurn === this.TurnPlayed + 1) {
                    yield trace.log(`${this.Owner.Name} gains 1 energy`);
                    this.Owner.CurrentEnergy += 1;
                    this.Owner.Element.ReRender();
                }
                break;
        }
    }
}
