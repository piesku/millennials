import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "tmnt-leonardo",
    class extends CardController {
        Name = "Beksiński";
        Cost = 3;
        Power = 5;
        Text = "";
        Sprite = Sprites.Leonardo;
    },
);
