import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Marble extends CardController {
    Name = "Marble";
    Cost = 1;
    Power = 0;
    Text = "<i>Clink!</i>";
    Sprite = Sprites.Marble;
    override IsVillain = true;
}
