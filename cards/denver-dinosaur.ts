import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class DenverDinosaur extends CardController {
    Name = "Vender Dino";
    Cost = 1;
    Power = 0;
    Description = "Each turn, +1 Power for each unspent Energy.";
    Sprite = Sprites.Denver;
    override SpriteOffset: number = 10;
    override *OnMessage(kind: Message, trace: Trace) {
        switch (kind) {
            case Message.TurnEnds:
                if (this.Owner.CurrentEnergy > 0) {
                    yield trace.Fork(-1).Log(this.AddModifier(this, "addpower", this.Owner.CurrentEnergy));
                }
                break;
        }
    }
}
