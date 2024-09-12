import {LocationController} from "../locations/LocationController.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class IndianaJones extends CardController {
    Name = "Iowa Jones";
    Cost = 4;
    Power = 10;
    Description = "You can only play this at locations where you are winning";
    Sprite = Sprites.IndianaJones;

    override CanBePlayedHere(location: LocationController): boolean {
        return location.GetScore(this.Owner) > location.GetScore(this.Opponent);
    }
}
