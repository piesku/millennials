import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "super-man",
    class extends CardController {
        Name = "Mupersan";
        Cost = 4;
        Power = 6;
        Text = "";
        Sprite = Sprites.Superman;
    },
);
