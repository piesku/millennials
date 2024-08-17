import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "homer-simpson",
    class extends CardController {
        Name = "Homer Simpson";
        Cost = 3;
        Power = 5;
        Text = "";
        Sprite = Sprites.Homer;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
