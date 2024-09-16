import {CardController} from "../cards/CardController.js";
import {LocationController} from "./LocationController.js";

export class OneTwoThree extends LocationController {
    Description = "Cards that cost 1, 2, or 3 cannot be played here.";
    override CanBePlayedHere(card: CardController) {
        return card.CurrentCost < 1 || 3 < card.CurrentCost;
    }
}
