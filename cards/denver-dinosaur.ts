import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "denver-dinosaur",
    class extends CardController {
        Name = "Vender Dinosaur";
        Cost = 5;
        Power = 8;
        Text = "";
        Sprite = Sprites.Denver;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
