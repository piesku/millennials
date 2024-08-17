import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "buzz-lightyear",
    class extends CardController {
        Name = "Buzzer Astronaut";
        Cost = 4;
        Power = 6;
        Text = "";
        Sprite = Sprites.Buzz;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
