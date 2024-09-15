import {CardElement} from "../elements/a-card.js";
import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class PowerpuffBubbles extends CardController {
    Name = "Bombles";
    Cost = 5;
    Power = 2;
    Description = "Once: Play 8-Power Atomic Girl to another location.";
    Sprite = Sprites.PowerpuffBubbles;

    override *OnReveal(trace: Trace) {
        const other_locations = this.Battle.Locations.filter(
            (location) => location !== this.Field && !location.IsFull(this.Owner),
        );
        const target_location = element(other_locations);

        if (target_location) {
            let card = document.createElement("a-card") as CardElement;
            card.setAttribute("type", Sprites.Marble.toString());
            card.Controller.Description = "<i>Saving the world before bedtime!</i>";
            card.Controller.Sprite = this.Sprite;
            card.Controller.Name = "Atomic Girl";
            card.Controller.Power = card.BasePower = 8;
            card.Controller.SpriteOffset = 5;

            yield trace.Log(`${this} plays ${card.Controller} to ${this.Field}`);
            yield* target_location.AddCard(card.Controller, trace, this.Owner);
        }
    }
}
