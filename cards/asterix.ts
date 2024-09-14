import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Asterix extends CardController {
    Name = "Asterisk";
    Cost = 6;
    Power = 4;
    Description = "Once: Clone highest Power cards opponent played this turn";
    Sprite = Sprites.Asterix;

    override *OnReveal(trace: Trace) {
        let highest_power = -Infinity;
        let highest_power_cards: CardController[] = [];

        const card_played_this_turn_by_the_opponent = this.Battle.GetRevealedCards(this.Opponent).filter(
            (card) => card.TurnPlayed === this.Battle.CurrentTurn,
        );

        for (let card of card_played_this_turn_by_the_opponent) {
            if (card.CurrentPower > highest_power) {
                highest_power = card.CurrentPower;
                highest_power_cards = [card];
            } else if (card.CurrentPower === highest_power) {
                highest_power_cards.push(card);
            }
        }

        for (let card of highest_power_cards) {
            let new_card = card.Clone();
            yield* card.Field!.AddCard(new_card.Controller, trace, this.Owner);
        }
    }
}
