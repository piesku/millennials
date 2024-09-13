import {Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class TurnSeven extends LocationController {
    Description = "This battle has an extra turn.";
    override *OnReveal(trace: Trace) {
        this.Battle.MaxTurns++;
        yield trace.Log(`this battle has ${this.Battle.MaxTurns} turns`);
    }
}
