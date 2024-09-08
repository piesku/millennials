import {CardController} from "../cards/CardController.js";
import {LocationController} from "./LocationController.js";

export class OneTwoThree extends LocationController {
    Name = "OneTwoThree";
    Description = "Cards that cost 1, 2, or 3 cannot be played here.";
    override CanBePlayedHere(card: CardController) {
        return card.CurrentCost > 3;
    }
}
