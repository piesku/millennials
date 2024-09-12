import {CardElement} from "../elements/a-card.js";
import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class PowerpuffBubbles extends CardController {
    Name = "Bombles";
    Cost = 5;
    Power = 2;
    Text = "Once: Add 8-Power clone to another location.";
    Sprite = Sprites.PowerpuffBubbles;

    override *OnReveal(trace: Trace) {
        const other_locations = this.Battle.Locations.filter(
            (location) => location !== this.Location && !location.IsFull(this.Owner),
        );
        const target_location = element(other_locations);

        if (target_location) {
            let card = document.createElement("a-card") as CardElement;
            card.setAttribute("type", Sprites.Marble.toString());
            card.Instance.Text = "Saving the world before bedtime!";
            card.Instance.Sprite = this.Sprite;
            card.Instance.Name = "Atomic Girl";
            card.Instance.AddModifier(this, "setpower", 8);
            yield* target_location.AddCard(card.Instance, trace, this.Owner);
        }
    }
}
