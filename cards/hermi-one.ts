import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Hermione extends CardController {
    Name = "Hermitwo";
    Cost = 2;
    Power = 3;
    Text = "After you play a card here, +2 Power.";
    Sprite = Sprites.Hermione;

    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        switch (kind) {
            case Message.CardEntersTable:
                if (card?.Location === this.Location && card?.Owner === this.Owner) {
                    yield trace.log(this.AddModifier(this, "addpower", 2));
                }
                break;
        }
    }
}
