import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class TetrisBlock extends CardController {
    Name = "Tetra Block";
    Cost = 4;
    Power = 8;
    Description = "Always: Trash all cards here if your side is full";
    Sprite = Sprites.TetrisBlock;

    override *OnMessageSelf(kind: Message, trace: Trace) {
        switch (kind) {
            case Message.CardEntersTable:
            case Message.CardMovesToLocation:
                if (this.Field?.IsFull(this.Owner)) {
                    for (let card of this.Field.GetRevealedCards(this.Owner)) {
                        yield* card.Trash(trace);
                    }
                }
                break;
        }
    }

    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Field !== this.Field) {
            return;
        }
        switch (kind) {
            case Message.CardEntersTable:
            case Message.CardMovesToLocation:
                if (this.Field?.IsFull(this.Owner)) {
                    for (let card of this.Field.GetRevealedCards(this.Owner)) {
                        yield* card.Trash(trace);
                    }
                }
                break;
        }
    }
}
