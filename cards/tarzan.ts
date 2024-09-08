import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Tarzan extends CardController {
    Name = "Jungle Kid";
    Cost = 4;
    Power = 6;
    Text = "<i>Aaah-aaah-aaah! Ooo-eee-ooo!</i>";
    Sprite = Sprites.Tarzan;
}
