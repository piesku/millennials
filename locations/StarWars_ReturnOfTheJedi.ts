import {CardController} from "../cards/CardController.js";
import {element} from "../lib/random.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class ReturnOfTheJedi extends LocationController {
    Name = "Return of the Jedi";
    Description = "Transform any card played here into another card of the same cost.";
    override *OnMessage(kind: Message, trace: Trace, card: CardController) {
        if (card?.Field === this) {
            switch (kind) {
                case Message.CardEntersTable:
                    let cards_of_same_cost: CardController[] = this.Battle.Game.Collection.AllCards.filter(
                        (c) => c.Name !== card.Name && c.CurrentCost === card.CurrentCost,
                    );

                    let other_card = element(cards_of_same_cost);
                    if (other_card) {
                        yield trace.Log(`${card} is now ${other_card}`);
                        card.Element.setAttribute("type", other_card.Element.getAttribute("type")!);
                        // Reveal the new card type.
                        yield* card.Element.Controller.Reveal(trace.Fork(), false);
                    }

                    break;
            }
        }
    }
}
