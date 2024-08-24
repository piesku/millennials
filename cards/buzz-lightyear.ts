import {Message} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class BuzzLightyear extends CardController {
    Name = "Buzzer Astronaut";
    Cost = 0;
    Power = 1;
    Text = "+1 energy next turn";
    Sprite = Sprites.Buzz;

    override *OnMessage(kind: Message) {
        switch (kind) {
            case Message.TurnStarts:
                if (this.Battle.CurrentTurn === this.TurnPlayed + 1) {
                    yield `${this.Owner.Name} gains 1 energy`;
                    this.Owner.CurrentEnergy += 1;
                    this.Owner.Element.ReRender();
                }
                break;
        }
    }
}
