import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "a-hannibal",
    class extends CardController {
        Name = "Hannibal";
        Cost = 4;
        Power = 6;
        Text = "";
        Sprite = Sprites.Hannibal;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
