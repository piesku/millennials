import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class AceVentura extends CardController {
    Name = "As Fortuna";
    Cost = 6;
    Power = 8;
    Description = "Once: Add four 2-Power Rhinos to each other location";
    Sprite = Sprites.AceVentura;

    override *OnReveal(trace: Trace) {
        for (const location of this.Battle.Locations) {
            if (location !== this.Field) {
                for (let i = 0; i < 4; i++) {
                    let card = document.createElement("a-card") as CardElement;
                    card.setAttribute("type", Sprites.Rhino.toString());
                    yield* location.AddCard(card.Controller, trace, this.Owner);
                }
            }
        }
    }
}
