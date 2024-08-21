import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

export class Neo extends CardController {
    Name = "One";
    Cost = 4;
    Power = 6;
    Text = "";
    Sprite = Sprites.Neo;
}
