import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "sim-ba",
    class extends CardController {
        Name = "King's Son";
        Cost = 2;
        Power = 3;
        Text = "";
        Sprite = Sprites.Simba;
    },
);
