import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "mufa-sa",
    class extends CardController {
        Name = "The King";
        Cost = 4;
        Power = 7;
        Text = "";
        Sprite = Sprites.Mufasa;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
