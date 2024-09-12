import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Tsubasa extends CardController {
    Name = "Captain Japan";
    Cost = 2;
    Power = 3;
    Text = "Always: +8 Power if your side here is full";
    Sprite = Sprites.Tsubasa;

    override *OnMessageSelf(kind: Message, trace: Trace) {
        switch (kind) {
            case Message.CardEntersTable:
            case Message.CardMovesToLocation:
                if (this.Location?.IsFull(this.Owner) && !this.HasModifiers(this)) {
                    yield trace.log(this.AddModifier(this, "addpower", 8));
                }
                break;
            case Message.CardLeavesTable:
            case Message.CardMovesFromLocation:
                this.RemoveModifiers(this);
                yield trace.log(`it no longer has +8 Power`);
                break;
        }
    }

    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Owner !== this.Owner) {
            return;
        }
        if (card?.Location !== this.Location) {
            return;
        }
        switch (kind) {
            case Message.CardEntersTable:
            case Message.CardMovesToLocation:
                if (this.Location?.IsFull(this.Owner) && !this.HasModifiers(this)) {
                    yield trace.log(this.AddModifier(this, "addpower", 8));
                }
                break;
            case Message.CardLeavesTable:
            case Message.CardMovesFromLocation:
                if (this.Location?.IsFull(this.Owner)) {
                    this.RemoveModifiers(this);
                    yield trace.log(`${this} no longer has +8 Power`);
                }
                break;
        }
    }
}
