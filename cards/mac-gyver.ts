import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "mac-gyver",
    class extends CardController {
        Name = "GacMyver";
        Cost = 3;
        Power = 5;
        Text = "";
        Sprite = Sprites.MacGyver;
    },
);
