import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "harry-potter",
    class extends CardController {
        Name = "Parry Hotter";
        Cost = 2;
        Power = 3;
        Text = "The Boy Who Lived";
        Sprite = Sprites.HarryPotter;
    },
);
