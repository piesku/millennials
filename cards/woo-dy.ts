import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "woo-dy",
    class extends CardController {
        Name = "Toy Cowboy";
        Cost = 3;
        Power = 4;
        Text = "";
        Sprite = Sprites.Woody;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
