import {CardController} from "../cards/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {ActorController} from "./ActorController.js";

const orc_name = "Org";
const goblin_name = "Gobelin";
const sauron_name = "Eye of Zauron";

export class Orc extends CardController {
    Name = orc_name;
    Cost = 1;
    Power = 2;
    Description = `<i>Where there's a whip, there's a way</i>`;
    Sprite = Sprites.Orc;
    override IsVillain = true;
    override SpriteOffset = 2;
}

export class Goblin extends CardController {
    Name = goblin_name;
    Cost = 2;
    Power = 4;
    Description = `Once: Draw ${sauron_name} or another card`;
    Sprite = Sprites.Goblin;
    override IsVillain = true;
    override SpriteOffset = 2;

    override *OnReveal(trace: Trace) {
        const cards = this.Owner.Deck.querySelectorAll<CardElement>("a-card");
        let found = false;

        for (const card of cards) {
            if (card.Controller.Name === sauron_name) {
                yield* card.Controller.AddToHand(this.Owner, trace);
                found = true;
                break;
            }
        }

        if (!found) {
            yield* this.Owner.DrawCard(trace);
        }
    }
}

export class Sauron extends CardController {
    Name = sauron_name;
    Cost = 6;
    Power = 1;
    Description = `Once: Add +2 Power to each ${orc_name} and ${goblin_name}`;
    Sprite = Sprites.Sauron;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        for (const card of this.Battle.GetRevealedCards()) {
            if (card.Name === orc_name || card.Name === goblin_name) {
                yield trace.log(card.AddModifier(this, "addpower", 2));
            }
        }
    }
}

export class FantasyController extends ActorController {
    Type = "villain" as const;
    Name = "Fantasy Villains";
    Sprite = Sprites.Orc;
    Description = "One to rule them all";
    StartingDeck = [
        Sprites.Orc,
        Sprites.Orc,
        Sprites.Orc,
        Sprites.Orc,
        Sprites.Orc,
        Sprites.Orc,
        Sprites.Goblin,
        Sprites.Goblin,
        Sprites.Goblin,
        Sprites.Goblin,
        Sprites.Goblin,
        Sprites.Sauron,
    ];
}
