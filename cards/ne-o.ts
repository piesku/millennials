import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "ne-o",
    class extends CardController {
        Name = "One";
        Cost = 4;
        Power = 6;
        Text = "";
        Sprite = Sprites.Neo;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
