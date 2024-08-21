import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

export class Morty extends CardController {
    Name = "Muorty";
    Cost = 1;
    Power = 2;
    Text = "";
    Sprite = Sprites.Morty;
}
