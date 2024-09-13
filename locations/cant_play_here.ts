import {CardController} from "../cards/CardController.js";
import {LocationController} from "./LocationController.js";

export class CastleBonehead extends LocationController {
    Description = "Player cards can't be played here.";
    override CanBePlayedHere(card: CardController): boolean {
        return card.Owner === this.Battle.Villain;
    }
}
