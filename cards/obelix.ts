import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Obelix extends CardController {
    Name = "Boulderix";
    Cost = 5;
    Power = 3;
    Description = "Always: +3 Power for each card in your hand";
    Sprite = Sprites.Obelix;

    override *OnMessageSelf(kind: Message, trace: Trace) {
        if (kind === Message.CardEntersTable) {
            yield trace.Log(this.AddModifier(this, "setpower", this.Power + this.Owner.Hand.childElementCount * 3));
        }
    }

    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Owner !== this.Owner) {
            return;
        }

        if (kind === Message.CardEntersHand || kind === Message.CardLeavesHand) {
            this.RemoveModifiers(this);
            yield trace.Log(this.AddModifier(this, "setpower", this.Power + this.Owner.Hand.childElementCount * 3));
        }
    }
}
