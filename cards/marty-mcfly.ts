import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class MartyMcFly extends CardController {
    Name = "McFarty";
    Cost = 1;
    Power = 3;
    Description = "Once: Add a random card to your hand";
    Sprite = Sprites.MartyMcFly;

    override *OnReveal(trace: Trace) {
        const all_cards = this.Battle.Game.Collection.AllCards;
        const random_card = element(all_cards);
        let clone = random_card.Clone();
        yield* clone.Controller.AddToHand(this.Owner, trace);
    }
}
