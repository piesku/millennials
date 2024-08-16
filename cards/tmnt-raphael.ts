import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "tmnt-raphael",
    class extends CardController {
        Name = "Raphael";
        Cost = 3;
        Power = 5;
        Text = "The muscle of the Teenage Mutant Ninja Turtles";
        Sprite = Sprites.Raphael;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("Raphael enters the table");
                    break;
            }
        }
    },
);
