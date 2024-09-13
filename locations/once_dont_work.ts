import {CardController} from "../cards/CardController.js";
import {LocationController} from "./LocationController.js";

export class OnceDontWork extends LocationController {
    Description = "Once abilities don't trigger here.";
    override CanOnRevealHere(card: CardController) {
        return false;
    }
}
