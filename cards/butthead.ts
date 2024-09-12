import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Butthead extends CardController {
    Name = "Ironbutt";
    Cost = 1;
    Power = 2;
    Description = "Once: Trash the cheapest card in the opponent's deck";
    Sprite = Sprites.Butthead;

    override *OnReveal(trace: Trace) {
        const deck = this.Opponent.Deck;
        if (deck.firstElementChild) {
            let cheapest = deck.firstElementChild as CardElement;

            for (let card of deck.querySelectorAll<CardElement>("a-card")) {
                if (card.Controller.CurrentCost < cheapest.Controller.CurrentCost) {
                    cheapest = card;
                }
            }

            yield* cheapest.Controller.Trash(trace);
        }
    }
}
