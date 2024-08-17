import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "robo-cop",
    class extends CardController {
        Name = "Coprobo";
        Cost = 2;
        Power = 4;
        Text = "Add 1 power to your other cards here";
        Sprite = Sprites.Robocop;

        override *OnReveal() {
            let other_revealed_cards = this.Location.GetRevealedCards(this.Owner.id);
            for (let card of other_revealed_cards) {
                yield `${card.Name} gets +1 power`;

                // TODO Helper on CardController?
                let modifier = document.createElement("a-modifier")!;
                modifier.setAttribute("origin", this.Name);
                modifier.setAttribute("op", "addpower");
                modifier.setAttribute("value", "1");
                card.appendChild(modifier);
            }
        }

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
