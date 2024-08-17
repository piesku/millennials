import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "james-bond",
    class extends CardController {
        Name = "James Bond";
        Cost = 5;
        Power = 7;
        Text = "";
        Sprite = Sprites.JamesBond;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
