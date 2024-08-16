import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "marty-mcfly",
    class extends CardController {
        Name = "Marty McFly";
        Cost = 1;
        Power = 3;
        Text = "Alzheimer, I'm in you!";
        Sprite = Sprites.MartyMcFly;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("CardEntersTable");
                    break;
            }
        }
    },
);
