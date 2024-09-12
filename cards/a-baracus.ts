import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Baracus extends CardController {
    Name = "B.D. Bacarus";
    Cost = 2;
    Power = 2;
    Description = "Once: +3 power if revealed in the middle location";
    Sprite = Sprites.BABaracus;

    override *OnReveal(trace: Trace) {
        DEBUG: if (!this.Field) {
            throw "Baracus has no location";
        }
        let index = this.Battle.Locations.indexOf(this.Field);
        if (index === 1) {
            yield trace.log(this.AddModifier(this, "addpower", 3));
        }
    }
}
