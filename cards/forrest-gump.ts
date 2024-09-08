import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class ForrestGump extends CardController {
    Name = "Gorrest Fump";
    Cost = 1;
    Power = 2;
    Text = "Once: The last card you played moves here";
    Sprite = Sprites.ForrestGump;

    override *OnReveal(trace: Trace) {
        const played_cards = this.Battle.PlayedCardsQueue;
        let last_played_card = null;

        for (let i = played_cards.length - 1; i >= 0; i--) {
            if (played_cards[i] !== this && played_cards[i].Owner === this.Owner) {
                last_played_card = played_cards[i];
                break;
            }
        }

        DEBUG: if (!this.Location) {
            throw "Card must be in a location";
        }

        if (last_played_card) {
            yield* last_played_card.Move(trace, this.Location, this.Owner);
        }
    }
}
