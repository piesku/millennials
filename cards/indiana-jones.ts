import {LocationElement} from "../elements/a-location.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class IndianaJones extends CardController {
    Name = "Iowa Jones";
    Cost = 4;
    Power = 10;
    Text = "You can only play this at locations where you are winning.";
    Sprite = Sprites.IndianaJones;

    override CanBePlayedHere(slot: HTMLElement): boolean {
        const location = slot.closest<LocationElement>("a-location");
        return !!location && location.Instance.GetScore(this.Owner) > location.Instance.GetScore(this.Opponent);
    }
}
