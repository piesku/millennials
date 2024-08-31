import {CardController} from "../cards/CardController.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {ActorController} from "./ActorController.js";

export class DarthVader extends CardController {
    Name = "Varth Dader";
    Cost = 5;
    Power = 8;
    Text = "";
    Sprite = Sprites.DarthVader;
}

export class Stormtrooper extends CardController {
    Name = "Raintrooper";
    Cost = 2;
    Power = 1;
    Text = `Once: +1 for each revealed ${this.Name}`;
    Sprite = Sprites.Stormtrooper;
    override *OnReveal(trace: Trace) {
        const revealedCards = this.Battle.GetRevealedCards();
        const sameNameCards = revealedCards.filter((card) => card.Name === this.Name);
        const count = sameNameCards.length;
        yield trace.log(`There are ${count} ${this.Name} cards revealed`);
        this.AddModifier(this, "addpower", count);
    }
}

export class EmpireController extends ActorController {
    Type = "villain" as const;
    Name = "Varth Dader";
    Sprite = Sprites.DarthVader;
    Description = "The Empire is a powerful force that seeks to control the galaxy";

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
