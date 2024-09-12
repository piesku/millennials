import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Donatello extends CardController {
    Name = "Bardi";
    Cost = 3;
    Power = 2;
    Description = "After you play a card, +1 Power";
    Sprite = Sprites.Donatello;

    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Owner === this.Owner) {
            switch (kind) {
                case Message.CardEntersTable:
                    yield trace.log(this.AddModifier(card!, "addpower", 1));

                    break;
            }
        }
    }
}
