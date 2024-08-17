import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "sim-ba",
    class extends CardController {
        Name = "King's Son";
        Cost = 2;
        Power = 3;
        Text = "";
        Sprite = Sprites.Simba;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
