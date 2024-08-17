import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "obi-wan-kenobi",
    class extends CardController {
        Name = "Kobi-Two Enobi";
        Cost = 3;
        Power = 5;
        Text = "";
        Sprite = Sprites.ObiWanKenobi;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
