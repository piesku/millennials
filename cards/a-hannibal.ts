import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Hannibal extends CardController {
    Name = "B-Team Cannibal";
    Cost = 4;
    Power = 6;
    Text = "Your other cards have +1 power.";
    Sprite = Sprites.Hannibal;

    override *OnReveal(trace: Trace) {
        for (let card of this.Battle.GetRevealedCards(this.Owner)) {
            yield trace.log(`${card} has +1 power`);
            card.AddModifier(this, "addpower", 1);
        }
    }

    override *OnMessage(kind: Message, trace: Trace, card: CardController) {
        switch (kind) {
            case Message.CardEntersTable:
                if (card.Owner === this.Owner) {
                    yield trace.log(`${card.Name} has +1 power from ${this}`);
                    card.AddModifier(this, "addpower", 1);
                }
                break;
        }
    }

    override *OnMessageSelf(kind: Message, trace: Trace) {
        switch (kind) {
            case Message.CardLeavesTable:
                this.Battle.CleanUp(this);
                break;
        }
    }
}
