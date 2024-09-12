import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Obelix extends CardController {
    Name = "Boulderix";
    Cost = 5;
    Power = 3;
    Text = "Always: +3 Power for each card in your hand";
    Sprite = Sprites.Obelix;

    override *OnMessageSelf(kind: Message, trace: Trace) {
        if (kind === Message.CardEntersTable) {
            const cards_in_hand = this.Owner.Hand.children.length;

            yield trace.log(this.AddModifier(this, "addpower", cards_in_hand * 3));
        }
    }

    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Owner !== this.Owner) {
            return;
        }

        const cards_in_hand = this.Owner.Hand.children.length;

        if (kind === Message.CardEntersHand || kind === Message.CardLeavesHand) {
            this.RemoveModifiers(this);
            yield trace.log(this.AddModifier(this, "addpower", cards_in_hand * 3));
        }
    }
}
