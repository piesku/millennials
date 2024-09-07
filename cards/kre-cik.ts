import {Sprites} from "../sprites/sprites.js";
import {CardController, Operator} from "./CardController.js";

export class Krecik extends CardController {
    Name = "Moleck";
    Cost = 6;
    Power = 2;
    Text = "";
    Sprite = Sprites.Krecik;

    override Operator = Operator.MULTIPLY;
}
