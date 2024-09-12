import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Krecik extends CardController {
    Name = "Moleck";
    Cost = 6;
    Power = 12;
    Description = "<i>Ahoj!</i>";
    Sprite = Sprites.Krecik;
    override SpriteOffset: number = 1;
}
