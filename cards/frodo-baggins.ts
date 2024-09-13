import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Frodo extends CardController {
    Name = "Brodo Smol";
    Cost = 4;
    Power = 4;
    Description = "Always: Your 1-Cost cards have +1 Power";
    Sprite = Sprites.Frodo;

    override *OnMessageSelf(kind: Message, trace: Trace) {
        switch (kind) {
            case Message.CardEntersTable:
                for (let card of this.Battle.GetRevealedCards(this.Owner)) {
                    if (card.CurrentCost === 1) {
                        yield trace.Log(card.AddModifier(this, "addpower", 1));
                    }
                }
                break;
            case Message.CardLeavesTable:
                this.Battle.CleanUp(this);
                break;
        }
    }

    override *OnMessage(kind: Message, trace: Trace, card: CardController) {
        switch (kind) {
            case Message.CardEntersTable:
                if (card.Owner === this.Owner && card.CurrentCost === 1) {
                    yield trace.Log(card.AddModifier(this, "addpower", 1));
                }
                break;
            case Message.CardLeavesTable:
                card.RemoveModifiers(this);
        }
    }
}
