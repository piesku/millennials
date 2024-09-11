import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class TetrisBlock extends CardController {
    Name = "Tetra Block";
    Cost = 4;
    Power = 0;
    Text = "";
    Sprite = Sprites.TetrisBlock;
}
