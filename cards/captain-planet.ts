import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class CaptainPlaner extends CardController {
    Name = "Captain Planer";
    Cost = 4;
    Power = 4;
    Description = "Once: Duplicate your hand";
    Sprite = Sprites.CaptainPlanet;

    override *OnReveal(trace: Trace) {
        for (const card of this.Owner.Hand.querySelectorAll<CardElement>("a-card")) {
            let clone = card.Controller.Clone();
            yield* clone.Controller.AddToHand(card.Controller.Owner, trace);
        }
    }
}
