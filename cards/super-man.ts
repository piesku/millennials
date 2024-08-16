import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "super-man",
    class extends CardController {
        Name = "Superman";
        Cost = 4;
        Power = 6;
        Text = "Man of Steel";
        Sprite = Sprites.Superman;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("Superman enters the table");
                    break;
            }
        }
    },
);
