import {element} from "../lib/random.js";
import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Kirilin extends CardController {
    Name = "Grillin";
    Cost = 2;
    Power = 3;
    Description = "When trashed, +2 Power and recycle at a random location";
    Sprite = Sprites.Kirilin;
    override SpriteOffset = 18;

    override *OnMessageSelf(kind: Message, trace: Trace): Generator<[Trace, string], void> {
        switch (kind) {
            case Message.CardEntersTrash:
                const random_location = element(this.Battle.GetPossibleLocations(this));
                if (random_location) {
                    yield trace.Log(`${this} respawns in ${random_location}`);
                    yield* random_location.AddCard(this, trace, this.Owner);
                    yield trace.Log(this.AddModifier(this, "addpower", 2));
                }
                break;
        }
    }
}
