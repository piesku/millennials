import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "tmnt-raphael",
    class extends CardController {
        Name = "Monet";
        Cost = 3;
        Power = 5;
        Text = "The muscle of the Teenage Mutant Ninja Turtles";
        Sprite = Sprites.Raphael;
    },
);
