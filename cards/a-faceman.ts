import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "a-faceman",
    class extends CardController {
        Name = "Faceman";
        Cost = 3;
        Power = 5;
        Text = "";
        Sprite = Sprites.Faceman;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
