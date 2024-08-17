import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "robo-cop",
    class extends CardController {
        Name = "Coprobo";
        Cost = 2;
        Power = 4;
        Text = "Part man, part machine, all cop";
        Sprite = Sprites.Robocop;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
