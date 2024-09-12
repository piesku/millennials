import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Neo extends CardController {
    Name = "One";
    Cost = 6;
    Power = 9;
    Description = "Once: Move your other cards one location to the left";
    Sprite = Sprites.Neo;

    override *OnReveal(trace: Trace) {
        const other_cards = this.Battle.GetRevealedCards(this.Owner);

        for (let card of other_cards) {
            const locations = this.Battle.Locations;
            const current_location_index = locations.indexOf(card.Field!);
            if (current_location_index > 0) {
                const new_location = locations[current_location_index - 1];
                if (new_location) {
                    yield* card.Move(trace, new_location, this.Owner);
                }
            }
        }
    }
}
