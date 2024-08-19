import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "bla-de",
    class extends CardController {
        Name = "Spike";
        Cost = 5;
        Power = 8;
        Text = "";
        Sprite = Sprites.Blade;
    },
);
