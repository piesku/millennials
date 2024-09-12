import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class TetrisBlock extends CardController {
    Name = "Tetra Block";
    Cost = 4;
    Power = 8;
    Text = "Always: Trash all cards here if location is full";
    Sprite = Sprites.TetrisBlock;

    override *OnMessageSelf(kind: Message, trace: Trace) {
        switch (kind) {
            case Message.CardEntersTable:
            case Message.CardMovesToLocation:
                if (this.Location?.IsFull(this.Owner)) {
                    for (let card of this.Location.GetRevealedCards(this.Owner)) {
                        yield* card.Trash(trace);
                    }
                }
                break;
        }
    }

    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Location !== this.Location) {
            return;
        }
        switch (kind) {
            case Message.CardEntersTable:
            case Message.CardMovesToLocation:
                if (this.Location?.IsFull(this.Owner)) {
                    for (let card of this.Location.GetRevealedCards(this.Owner)) {
                        yield* card.Trash(trace);
                    }
                }
                break;
        }
    }
}
