import {element} from "../lib/random.js";
import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Kirilin extends CardController {
    Name = "Grillin";
    Cost = 2;
    Power = 3;
    Text = "When trashed, +2 Power and add to a random location";
    Sprite = Sprites.Kirilin;
    override SpriteOffset = 18;

    override *OnMessageSelf(kind: Message, trace: Trace): Generator<[Trace, string], void> {
        switch (kind) {
            case Message.CardEntersTrash:
                // TODO Get empty locations.
                const random_location = element(this.Battle.GetPossibleLocations(this));
                if (random_location) {
                    yield trace.log(`${this} respawns in ${random_location}`);
                    this.AddModifier(this, "addpower", 2);
                    yield* random_location.AddCard(this, trace, this.Owner);
                }
                break;
        }
    }
}
