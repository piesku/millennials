import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "a-murdock",
    class extends CardController {
        Name = "Murdock";
        Cost = 3;
        Power = 5;
        Text = "";
        Sprite = Sprites.Murdock;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
