import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class KevinHomeAlone extends CardController {
    Name = "Empty House";
    Cost = 2;
    Power = 7;
    Text = "Always: -6 Power if your opponent's part of the location is full";
    Sprite = Sprites.KevinHomeAlone;

    override *OnMessageSelf(kind: Message, trace: Trace) {
        switch (kind) {
            case Message.CardEntersTable:
            case Message.CardMovesToLocation:
                if (this.Location?.IsFull(this.Opponent)) {
                    this.AddModifier(this, "addpower", -6);
                    yield trace.log(`it has -6 Power`);
                }
                break;
        }
    }

    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Owner !== this.Opponent) {
            return;
        }
        if (card?.Location !== this.Location) {
            return;
        }
        switch (kind) {
            case Message.CardEntersTable:
            case Message.CardMovesToLocation:
                if (this.Location?.IsFull(this.Opponent)) {
                    this.AddModifier(this, "addpower", -6);
                    yield trace.log(`${this} has -6 Power`);
                }
                break;
            case Message.CardLeavesTable:
            case Message.CardMovesFromLocation:
                if (!this.HasModifiers(this)) {
                    return;
                }
                if (!this.Location?.IsFull(this.Opponent)) {
                    this.RemoveModifiers(this);
                    yield trace.log(`${this} no longer has -6 Power`);
                }
                break;
        }
    }
}
