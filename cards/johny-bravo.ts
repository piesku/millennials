import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class JohnyBravo extends CardController {
    Name = "Johny Alpha";
    Cost = 3;
    Power = 6;
    Description = "Once: Shuffle Placki into your deck.";
    Sprite = Sprites.JohnyBravo;

    override *OnReveal(trace: Trace) {
        let card = document.createElement("a-card") as CardElement;
        card.setAttribute("type", Sprites.Placki.toString());
        yield* card.Controller.AddToDeck(this.Owner, trace);
    }
}

export class Placki extends CardController {
    Name = "Placki";
    Cost = 0;
    Power = 0;
    Description = "Once: Give Johny Alpha +6 Power.";
    Sprite = Sprites.Placki;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        const revealed_cards = this.Battle.GetRevealedCards();
        for (const card of revealed_cards) {
            if (card.Name === "Johny Alpha") {
                yield trace.log(card.AddModifier(this, "addpower", 6));
            }
        }
    }
}
