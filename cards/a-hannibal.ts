import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Hannibal extends CardController {
    Name = "B. Cannibal";
    Cost = 5;
    Power = 3;
    Text = "Your other cards have +1 power.";
    Sprite = Sprites.Hannibal;

    override *OnMessageSelf(kind: Message, trace: Trace) {
        switch (kind) {
            case Message.CardEntersTable:
                for (let card of this.Battle.GetRevealedCards(this.Owner)) {
                    yield trace.log(card.AddModifier(this, "addpower", 1));
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
                if (card.Owner === this.Owner) {
                    yield trace.log(card.AddModifier(this, "addpower", 1));
                }
                break;
        }
    }
}
