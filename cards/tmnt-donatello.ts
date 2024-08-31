import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Donatello extends CardController {
    Name = "Young Tortoise Picasso";
    Cost = 3;
    Power = 1;
    Text = "After you play a card, this gains +1 Power";
    Sprite = Sprites.Donatello;

    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        trace.push(this);
        switch (kind) {
            case Message.CardEntersTable:
                if (card?.Owner === this.Owner && this.Battle.PlayedCardsQueue.includes(card)) {
                    yield trace.log(`${this.Name} gets +1 power`);
                    this.AddModifier(card!, "addpower", 1);
                }
                break;
        }
    }
}
