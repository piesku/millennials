import {element} from "../lib/random.js";
import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class LukeSkywalker extends CardController {
    Name = "Suke Lywalker";
    Cost = 1;
    Power = 5;
    Text = "After each turn, this moves";
    Sprite = Sprites.LukeSkywalker;

    override *OnMessage(kind: Message, trace: Trace, card?: CardController): Generator<[Trace, string], void> {
        if (kind === Message.TurnEnds && this.Location) {
            let other_locations = this.Battle.Locations.filter(
                (location) => location !== this.Location && !location.IsFull(this.Owner),
            );
            if (other_locations.length > 0) {
                yield* this.Move(trace.fork(-1), element(other_locations), this.Owner);
            }
        }
    }
}
