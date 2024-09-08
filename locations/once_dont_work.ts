import {CardController} from "../cards/CardController.js";
import {LocationController} from "./LocationController.js";

export class OnceDontWork extends LocationController {
    Name = "OnceDontWork";
    Description = "Once abilities don't work here.";
    override CanOnRevealHere(card: CardController) {
        return false;
    }
}
