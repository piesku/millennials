import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "robin-hood",
    class extends CardController {
        Name = "Hobin Rood";
        Cost = 1;
        Power = 2;
        Text = "";
        Sprite = Sprites.RobinHood;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
