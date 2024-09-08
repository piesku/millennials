import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class HomerSimpson extends CardController {
    Name = "Hover S.";
    Cost = 3;
    Power = 5;
    Text = "<i>D'oh!</i>";
    Sprite = Sprites.Homer;
}
