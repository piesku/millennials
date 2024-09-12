import {CardElement} from "../elements/a-card.js";
import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class MartyMcFly extends CardController {
    Name = "Flarty McMy";
    Cost = 1;
    Power = 3;
    Text = "Once: Add a random card to your hand";
    Sprite = Sprites.MartyMcFly;

    override *OnReveal(trace: Trace) {
        const all_cards = this.Battle.Game.Collection.AllCards;
        const random_card_type = element(all_cards);
        let card = document.createElement("a-card") as CardElement;
        card.setAttribute("type", random_card_type.Element.getAttribute("type")!);
        yield* card.Instance.AddToHand(this.Owner, trace);
    }
}
