import {LocationController} from "../locations/LocationController.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Megaman extends CardController {
    Name = "Gigaman";
    Cost = 6;
    Power = 20;
    Text = "If you played a card last turn, you can't play this";
    Sprite = Sprites.Megaman;

    override CanBePlayedHere(location: LocationController): boolean {
        let lastTurn = this.Battle.CurrentTurn - 1;
        let cardsPlayedLastTurn = this.Battle.GetRevealedCards(this.Owner);
        for (let card of cardsPlayedLastTurn) {
            if (card.TurnPlayed === lastTurn) {
                return false;
            }
        }
        return true;
    }
}
