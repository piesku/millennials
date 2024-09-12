import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Ron extends CardController {
    Name = "Magic Ginger";
    Cost = 3;
    Power = 4;
    Text = "Always: Cards here can't be trashed";
    Sprite = Sprites.Ron;
}
