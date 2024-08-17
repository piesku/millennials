import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "rick-sanchez",
    class extends CardController {
        Name = "Sick Ranchez";
        Cost = 4;
        Power = 7;
        Text = "";
        Sprite = Sprites.RickSanchez;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
