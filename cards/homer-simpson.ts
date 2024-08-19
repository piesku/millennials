import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "homer-simpson",
    class extends CardController {
        Name = "Somer Himpson";
        Cost = 3;
        Power = 5;
        Text = "";
        Sprite = Sprites.Homer;
    },
);
