import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "a-faceman",
    class extends CardController {
        Name = "B-Team Shitface";
        Cost = 2;
        Power = 3;
        Text = "Draw a card from your rival's deck";
        Sprite = Sprites.Faceman;

        override *OnReveal() {}
    },
);
