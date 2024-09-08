import {Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class TurnSeven extends LocationController {
    Name = "TurnSeven";
    Description = "There is turn 7 in this battle.";
    override *OnReveal(trace: Trace) {
        yield trace.log("there is turn 7 in this battle.");
        this.Battle.MaxTurns = 7;
    }
}
