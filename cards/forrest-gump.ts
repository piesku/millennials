import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

export class ForrestGump extends CardController {
    Name = "Gorrest Fump";
    Cost = 3;
    Power = 2;
    Text = "Run Forrest, Run!";
    Sprite = Sprites.ForrestGump;
}
