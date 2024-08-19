import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "james-bond",
    class extends CardController {
        Name = "Bames Jond";
        Cost = 5;
        Power = 7;
        Text = "";
        Sprite = Sprites.JamesBond;
    },
);
