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
    },
);
