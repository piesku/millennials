import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Hermione extends CardController {
    Name = "Hermitwo";
    Cost = 2;
    Power = 3;
    Description = "After you play a card here, +2 Power.";
    Sprite = Sprites.Hermione;

    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        switch (kind) {
            case Message.CardEntersTable:
                if (card?.Field === this.Field && card?.Owner === this.Owner) {
                    yield trace.Log(this.AddModifier(this, "addpower", 2));
                }
                break;
        }
    }
}
