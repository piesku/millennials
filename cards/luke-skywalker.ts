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
            const empty_slots = this.Battle.GetEmptySlots(this.Owner);
            if (empty_slots.length === 0) {
                yield trace.log(`${this.Name} has no place to move`);
                return;
            }
            const random_slot = element(empty_slots);
            yield* this.Move(trace, random_slot);
        }
    }
}
