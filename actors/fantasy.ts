import {CardController} from "../cards/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {ActorController} from "./ActorController.js";

const orc_name = "Org";
const goblin_name = "Golbin";
const sauron_name = "Eye of Zauron";

export class Orc extends CardController {
    Name = orc_name;
    Cost = 1;
    Power = 1;
    Text = `<i>Where there's a whip, there's a way</i>`;
    Sprite = Sprites.Orc;
    override IsVillain = true;
}

export class Goblin extends CardController {
    Name = goblin_name;
    Cost = 2;
    Power = 4;
    Text = `Once: Find the ${sauron_name} in the deck and put it in hand. If not found, draw one card.`;
    Sprite = Sprites.Goblin;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        const deck = this.Owner.Element.querySelector("a-deck")!;
        const cards = deck.querySelectorAll<CardElement>("a-card");
        let found = false;

        for (const card of cards) {
            if (card.Instance.Name === sauron_name) {
                yield* card.Instance.AddToHand(this.Owner, trace);
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
    Cost = 5;
    Power = 1;
    Text = `Once: Add +2 Power to each ${orc_name} and ${goblin_name}`;
    Sprite = Sprites.Sauron;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        const owners_revealed_cards = this.Battle.GetRevealedCards(this.Owner);
        const opponents_revealed_cards = this.Battle.GetRevealedCards(this.Opponent);

        for (const card of [...owners_revealed_cards, ...opponents_revealed_cards]) {
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

    *StartBattle(trace: Trace) {
        const deck = this.Element.querySelector("a-deck")!;
        const cardDistribution = {
            [Sprites.Orc]: 6,
            [Sprites.Goblin]: 5,
            [Sprites.Sauron]: 1,
        };

        for (const [sprite, count] of Object.entries(cardDistribution)) {
            for (let i = 0; i < count; i++) {
                let card = document.createElement("a-card");
                card.setAttribute("type", sprite);
                deck.append(card);
            }
        }

        for (let i = 0; i < 3; i++) {
            yield* this.DrawCard(trace);
        }
    }
}
