import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "indiana-jones",
    class extends CardController {
        Name = "Iowa Jones";
        Cost = 4;
        Power = 6;
        Text = "";
        Sprite = Sprites.IndianaJones;
    },
);
