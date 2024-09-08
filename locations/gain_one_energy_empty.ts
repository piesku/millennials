import {CardController} from "../cards/CardController.js";
import {Message, Trace} from "../messages.js";
import {LocationController} from "./LocationController.js";

export class GainOneEnergyEmpty extends LocationController {
    Name = "GainOneEnergyEmpty";
    Description = "If you have no cards here at the start of a turn, gain +1 energy.";
    override *OnMessage(kind: Message, trace: Trace, card: CardController) {
        if (kind === Message.TurnStarts) {
            if (this.GetRevealedCards(this.Battle.Player).length === 0) {
                this.Battle.Player.CurrentEnergy += 1;
                this.Battle.Player.Element.Render();
                yield trace.log(`${this.Battle.Player} gain +1 energy`);
            }

            if (this.GetRevealedCards(this.Battle.Villain).length === 0) {
                this.Battle.Villain.CurrentEnergy += 1;
                this.Battle.Villain.Element.Render();
                yield trace.log(`${this.Battle.Player} gain +1 energy`);
            }
        }
    }
}
