import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class KevinHomeAlone extends CardController {
    Name = "Empty House";
    Cost = 2;
    Power = 7;
    Description = "Always: -6 Power if opponent's side is full";
    Sprite = Sprites.KevinHomeAlone;

    override *OnMessageSelf(kind: Message, trace: Trace) {
        switch (kind) {
            case Message.CardEntersTable:
            case Message.CardMovesToLocation:
                if (this.Field?.IsFull(this.Opponent) && !this.HasModifiers(this)) {
                    yield trace.log(this.AddModifier(this, "addpower", -6));
                }
                break;
            case Message.CardLeavesTable:
            case Message.CardMovesFromLocation:
                this.RemoveModifiers(this);
                yield trace.log(`it no longer has -6 Power`);
                break;
        }
    }

    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Owner === this.Owner) {
            return;
        }
        if (card?.Field !== this.Field) {
            return;
        }
        switch (kind) {
            case Message.CardEntersTable:
            case Message.CardMovesToLocation:
                if (this.Field?.IsFull(this.Opponent) && !this.HasModifiers(this)) {
                    yield trace.log(this.AddModifier(this, "addpower", -6));
                }
                break;
            case Message.CardLeavesTable:
            case Message.CardMovesFromLocation:
                if (this.Field?.IsFull(this.Opponent)) {
                    this.RemoveModifiers(this);
                    yield trace.log(`${this} no longer has -6 Power`);
                }
                break;
        }
    }
}
