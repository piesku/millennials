import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "a-baracus",
    class extends CardController {
        Name = "B-Team A.B. Bacarus";
        Cost = 3;
        Power = 5;
        Text = "";
        Sprite = Sprites.BABaracus;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
