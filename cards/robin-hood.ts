import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "robin-hood",
    class extends CardController {
        Name = "Robin Hood";
        Cost = 1;
        Power = 2;
        Text = "Coz' he ain't eatin' too much";
        Sprite = Sprites.RobinHood;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("CardEntersTable");
                    break;
            }
        }
    },
);
