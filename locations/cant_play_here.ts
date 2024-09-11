import {CardController} from "../cards/CardController.js";
import {LocationController} from "./LocationController.js";

export class CastleBonehead extends LocationController {
    Name = "Castle Bonehead 💀";
    Description = "Card can't be played here";
    override CanBePlayedHere(card: CardController): boolean {
        return false;
    }
}
