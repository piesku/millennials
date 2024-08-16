import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "ne-o",
    class extends CardController {
        Name = "Neo";
        Cost = 4;
        Power = 6;
        Text = "The One";
        Sprite = Sprites.Neo;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("Neo enters the table");
                    break;
            }
        }
    },
);
