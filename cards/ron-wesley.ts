import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "ron-wesley",
    class extends CardController {
        Name = "Magic Ginger";
        Cost = 3;
        Power = 5;
        Text = "";
        Sprite = Sprites.Ron;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
