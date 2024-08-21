import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

export class Krecik extends CardController {
    Name = "Szczurek";
    Cost = 6;
    Power = 12;
    Text = "";
    Sprite = Sprites.Krecik;
}
