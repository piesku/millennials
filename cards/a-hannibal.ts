import {CardController} from "../controllers/CardController.js";
import {Message} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "a-hannibal",
    class extends CardController {
        Name = "B-Team Cannibal";
        Cost = 4;
        Power = 6;
        Text = "Your other cards have +1 power.";
        Sprite = Sprites.Hannibal;

        override *OnReveal() {
            for (let card of this.Battle.GetRevealedCards(this.Owner.id)) {
                yield `${card.Name} has +1 power`;
                card.AddModifier(this, "addpower", 1);
            }
        }

        override *OnMessage(kind: Message, card: CardController) {
            switch (kind) {
                case Message.CardEntersTable:
                    if (card.Owner === this.Owner) {
                        yield `it has +1 power from ${this.Name}`;
                        card.AddModifier(this, "addpower", 1);
                    }
                    break;
            }
        }
    },
);
