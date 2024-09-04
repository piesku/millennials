import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class MartyMcFly extends CardController {
    Name = "Flarty McMy";
    Cost = 1;
    Power = 3;
    Text = "Each turn your opponent doesn't play a card here, +2 Power.";
    Sprite = Sprites.MartyMcFly;

    override *OnMessage(kind: Message, trace: Trace, card?: CardController): Generator<[Trace, string], void> {
        if (kind === Message.TurnEnds && this.Location) {
            const opponent_cards = this.Location.GetRevealedCards(this.Opponent);
            const current_turn = this.Battle.CurrentTurn;
            const opponent_cards_played_this_turn = opponent_cards.filter((card) => card.TurnPlayed === current_turn);
            if (opponent_cards_played_this_turn.length === 0) {
                yield trace.log(
                    `${this.Name} gains 2 Power because the opponent didn't play a card to the ${this.Location.Name}`,
                );
                this.AddModifier(this, "addpower", 2);
            }
        }
    }
}
