import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "bat-man",
    class extends CardController {
        Name = "Batman";
        Cost = 3;
        Power = 5;
        Text = "The Dark Knight";
        Sprite = Sprites.Batman;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("Batman enters the table");
                    break;
            }
        }
    },
);
