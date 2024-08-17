import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "harry-potter",
    class extends CardController {
        Name = "Parry Hotter";
        Cost = 2;
        Power = 3;
        Text = "The Boy Who Lived";
        Sprite = Sprites.HarryPotter;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("Harry Potter enters the table");
                    break;
            }
        }
    },
);
