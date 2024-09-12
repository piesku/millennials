import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {LocationController} from "./LocationController.js";

export class ShuffleMarbles extends LocationController {
    Name = "ShuffleMarbles";
    Description = "Shuffle 5 marbles into each player's deck.";
    override *OnReveal(trace: Trace) {
        for (let i = 0; i < 5; i++) {
            let card = document.createElement("a-card") as CardElement;
            card.setAttribute("type", Sprites.Marble.toString());
            yield* card.Controller.AddToDeck(this.Battle.Villain, trace);
        }
        for (let i = 0; i < 5; i++) {
            let card = document.createElement("a-card") as CardElement;
            card.setAttribute("type", Sprites.Marble.toString());
            yield* card.Controller.AddToDeck(this.Battle.Player, trace);
        }
    }
}
