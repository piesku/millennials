import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Butthead extends CardController {
    Name = "Ironbutt";
    Cost = 1;
    Power = 2;
    Text = "Once: Trash the cheapest card in the opponent's deck";
    Sprite = Sprites.Butthead;

    override *OnReveal(trace: Trace) {
        const deck = this.Owner.Element.querySelector("a-deck");
        if (deck && deck.firstElementChild) {
            let cheapest = deck.firstElementChild as CardElement;

            for (let card of deck.querySelectorAll<CardElement>("a-card")) {
                if (card.Instance.Cost < cheapest.Instance.Cost) {
                    cheapest = card;
                }
            }

            yield* cheapest.Instance.Trash(trace);
        }
    }
}
