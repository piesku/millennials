import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {ActorController} from "./ActorController.js";

export class KungFuController extends ActorController {
    Type = "villain" as const;
    Name = "Snow Leopard";
    Sprite = Sprites.KungFuPanda;
    Description = "I've not watched the movie, so I don't know what to put here";

    *StartBattle(trace: Trace) {
        const deck = this.Element.querySelector("a-deck")!;
        const cardDistribution = {
            [Sprites.Stormtrooper]: 11,
            [Sprites.DarthVader]: 1,
        };

        for (const [sprite, count] of Object.entries(cardDistribution)) {
            for (let i = 0; i < count; i++) {
                let card = document.createElement("a-card");
                card.setAttribute("type", sprite);
                deck.appendChild(card);
            }
        }

        for (let i = 0; i < 3; i++) {
            yield* this.DrawCard(trace);
        }
    }
}
