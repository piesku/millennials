import {CardController} from "../controllers/CardController.js";
import {Message} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "denver-dinosaur",
    class extends CardController {
        Name = "Vender Dinosaur";
        Cost = 1;
        Power = 0;
        Text = "After each turn, gain 1 Power for each unspent Energy.";
        Sprite = Sprites.Denver;

        override *OnMessage(kind: Message) {
            switch (kind) {
                case Message.TurnEnds:
                    if (this.Owner.CurrentEnergy > 0) {
                        yield `${this.Name} gains +${this.Owner.CurrentEnergy} power`;
                        this.AddModifier(this, "addpower", this.Owner.CurrentEnergy);
                    }
                    break;
            }
        }
    },
);
