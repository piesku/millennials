import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "woo-dy",
    class extends CardController {
        Name = "Toy Cowboy";
        Cost = 3;
        Power = 4;
        Text = "Add the top card of your deck here.";
        Sprite = Sprites.Woody;

        override *OnReveal() {
            let card = this.Owner.querySelector("a-deck")!.firstElementChild as CardController;
            if (card) {
                yield `it adds ${card.Name} to the table`;
                yield* this.Location.AddCard(card, this.Owner.id);
            } else {
                yield "but the deck is empty";
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
