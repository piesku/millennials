import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "hermi-one",
    class extends CardController {
        Name = "Hermitwo";
        Cost = 4;
        Power = 6;
        Text = "";
        Sprite = Sprites.Hermione;
    },
);
