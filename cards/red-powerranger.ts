import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class RedPowerRanger extends CardController {
    Name = "Red Guardian";
    Cost = 1;
    Power = 2;
    Description = "<i>Go Go!</i>";
    Sprite = Sprites.RedPowerRanger;
}
