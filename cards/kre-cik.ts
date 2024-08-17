import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "kre-cik",
    class extends CardController {
        Name = "Krecik";
        Cost = 6;
        Power = 12;
        Text = "";
        Sprite = Sprites.Krecik;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
