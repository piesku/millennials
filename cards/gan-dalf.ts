import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Gandalf extends CardController {
    Name = "White Wizard";
    Cost = 5;
    Power = 7;
    Description = "Once: Transform your other cards here into cards that cost 1 more";
    Sprite = Sprites.Gandalf;

    override *OnReveal(trace: Trace) {
        let cards_here = this.Field!.GetRevealedCards(this.Owner);
        let all_cards = this.Battle.Game.Collection.AllCardsByCost();
        for (let card of cards_here) {
            let cards_costing_1_more = all_cards[card.CurrentCost + 1] || [];
            let random_card_type = element(cards_costing_1_more);
            if (random_card_type) {
                card.Element.setAttribute("type", random_card_type.Sprite.toString());
                yield* card.Element.Controller.Reveal(trace, false);
            }
        }
    }
}
