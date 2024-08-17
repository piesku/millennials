import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "tmnt-donatello",
    class extends CardController {
        Name = "Picasso";
        Cost = 3;
        Power = 5;
        Text = "";
        Sprite = Sprites.Donatello;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
