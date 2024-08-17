import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "mac-gyver",
    class extends CardController {
        Name = "MacGyver";
        Cost = 3;
        Power = 5;
        Text = "";
        Sprite = Sprites.MacGyver;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
