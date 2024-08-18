import {CardController} from "../controllers/CardController.js";
import {Message} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "buzz-lightyear",
    class extends CardController {
        Name = "Buzzer Astronaut";
        Cost = 4;
        Power = 6;
        Text = "+1 energy next turn";
        Sprite = Sprites.Buzz;

        override *OnMessage(kind: Message) {
            switch (kind) {
                case Message.TurnStarts:
                    if (this.Battle.CurrentTurn === this.TurnPlayed + 1) {
                        yield `${this.Owner} gains 1 energy`;
                        this.Owner.CurrentEnergy += 1;
                    }
                    break;
            }
        }
    },
);
