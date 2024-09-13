import {Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class GainOneEnergy extends LocationController {
    Name = "GainOneEnergy";
    Description = "Gain +1 energy.";
    override *OnReveal(trace: Trace) {
        this.Battle.Player.CurrentEnergy += 1;
        this.Battle.Player.Element.Render();
        yield trace.Log(`${this.Battle.Player} gain +1 energy`);

        this.Battle.Villain.CurrentEnergy += 1;
        this.Battle.Villain.Element.Render();
        yield trace.Log(`${this.Battle.Player} gain +1 energy`);
    }
}
