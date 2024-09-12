import {CardController} from "../cards/CardController.js";
import {LocationController} from "./LocationController.js";

export class CastleBonehead extends LocationController {
    Name = "Castle Bonehead 💀";
    // TODO All cards, or just player cards?
    Description = "Cards can't be played here.";
    override CanBePlayedHere(card: CardController): boolean {
        return false;
    }
}
