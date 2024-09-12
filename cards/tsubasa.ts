import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Tsubasa extends CardController {
    Name = "Captain Japan";
    Cost = 2;
    Power = 3;
    Text = "If your side of the location is full, +8 Power";
    Sprite = Sprites.Tsubasa;

    override *OnMessageSelf(kind: Message, trace: Trace) {
        switch (kind) {
            case Message.CardEntersTable:
            case Message.CardMovesToLocation:
                if (this.Location?.IsFull(this.Owner)) {
                    this.AddModifier(this, "addpower", 8);
                    yield trace.log(`it has +8 Power`);
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
                if (this.Location?.IsFull(this.Owner)) {
                    this.AddModifier(this, "addpower", 8);
                    yield trace.log(`${this} has +8 Power`);
                }
                break;
            case Message.CardLeavesTable:
            case Message.CardMovesFromLocation:
                if (!this.HasModifiers(this)) {
                    return;
                }
                if (!this.Location?.IsFull(this.Owner)) {
                    this.RemoveModifiers(this);
                    yield trace.log(`${this} no longer has +8 Power`);
                }
                break;
        }
    }
}
