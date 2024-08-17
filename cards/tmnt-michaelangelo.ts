import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "tmnt-michaelangelo",
    class extends CardController {
        Name = "Van Gogh";
        Cost = 3;
        Power = 5;
        Text = "";
        Sprite = Sprites.MichaelAngelo;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
