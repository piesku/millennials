import {CardElement} from "../elements/a-card.js";
import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class JohnMcClane extends CardController {
    Name = "Hard Die";
    Cost = 4;
    Power = 8;
    Description = "Once: Trash two cards from your hand";
    Sprite = Sprites.JohnMcClane;

    override *OnReveal(trace: Trace) {
        {
            let random_card = element(this.Owner.Hand.querySelectorAll<CardElement>("a-card"));
            if (random_card) {
                yield* random_card.Controller.Trash(trace);
            }
        }
        {
            let random_card = element(this.Owner.Hand.querySelectorAll<CardElement>("a-card"));
            if (random_card) {
                yield* random_card.Controller.Trash(trace);
            }
        }
    }
}
