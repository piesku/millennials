import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class InspectorGadget extends CardController {
    Name = "Officer Widget";
    Cost = 5;
    Power = 0;
    Text = "";
    Sprite = Sprites.InspectorGadget;
}
