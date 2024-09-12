import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Rhino extends CardController {
    Name = "Rhinoceros";
    Cost = 1;
    Power = 2;
    Description = "<i>Growl!</i>";
    Sprite = Sprites.Rhino;
    override IsVillain = true;
}
