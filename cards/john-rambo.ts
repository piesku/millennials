import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class JohnRambo extends CardController {
    Name = "Ron Jambo";
    Cost = 5;
    Power = 0;
    Description = "Always: Your combined Power is doubled here";
    Sprite = Sprites.JohnRambo;
}
