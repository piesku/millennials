import {CardElement} from "../elements/a-card.js";
import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class TheMask extends CardController {
    Name = "The Skam";
    Cost = 6;
    Power = 6;
    Description = "Once: Recycle all your trashed cards to random locations";
    Sprite = Sprites.TheMask;

    override *OnReveal(trace: Trace) {
        let trashed_cards = this.Owner.Element.querySelectorAll<CardElement>("a-trash a-card")!;

        for (const card of trashed_cards) {
            const available_locations = this.Battle.Locations.filter((location) => !location.IsFull(this.Owner));
            const random_location = element(available_locations);

            if (!random_location) {
                continue;
            }

            yield trace.Log(`Resurrecting ${card.Controller} to ${random_location}`);
            yield* random_location.AddCard(card.Controller, trace, this.Owner);
        }
    }
}
