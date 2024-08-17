import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "hermi-one",
    class extends CardController {
        Name = "Hermione";
        Cost = 4;
        Power = 6;
        Text = "";
        Sprite = Sprites.Hermione;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
