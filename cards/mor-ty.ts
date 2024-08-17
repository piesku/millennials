import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "mor-ty",
    class extends CardController {
        Name = "Muorty";
        Cost = 1;
        Power = 2;
        Text = "";
        Sprite = Sprites.Morty;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
