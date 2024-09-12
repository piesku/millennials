import {CardController} from "../cards/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {element, shuffle} from "../lib/random.js";
import {LocationType} from "../locations/LocationController.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {ActorController} from "./ActorController.js";

export class DaltonBro extends CardController {
    Name = "Palton Brother";
    Cost = 1;
    Power = 2;
    Text = `Once: Give up to 2 random ${this.Name}s +1 Power`;
    Sprite = Sprites.DaltonBro;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        const other_dalton_cards = [
            ...this.Battle.GetRevealedCards(this.Owner),
            ...this.Battle.GetRevealedCards(this.Opponent),
        ].filter((card) => card.Name === this.Name);

        const shuffled = shuffle(other_dalton_cards);

        for (const card of shuffled.slice(0, 2)) {
            yield trace.log(card.AddModifier(this, "addpower", 1));
        }
    }
}

export class MojoJojo extends CardController {
    Name = "DojoBojo";
    Cost = 3;
    Power = 6;
    Text = "Once: Turn one of the opponent's cards in hand to a Marble";
    Sprite = Sprites.MojoJojo;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        let opponent_hand = this.Opponent.Hand.querySelectorAll<CardElement>("a-card");
        let card_to_transform = element(opponent_hand);
        if (card_to_transform) {
            let old_card_instance = card_to_transform.Instance;
            card_to_transform.setAttribute("type", Sprites.Marble.toString());
            yield trace.log(`${old_card_instance} is now a ${card_to_transform.Instance}!`);
        }
    }
}

export class Joker extends CardController {
    Name = "Poker";
    Cost = 5;
    Power = 0;
    // TODO All cards, or just the cards here?
    Text = "Once: Repeat the Once abilities of all your revealed cards.";
    Sprite = Sprites.Joker;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        for (const card of this.Battle.GetRevealedCards(this.Owner)) {
            if (!card.Text.startsWith("Once") || trace.includes(card)) {
                continue;
            }

            yield trace.log(`repeating ${card}'s ability`);
            yield* card.OnReveal(trace.fork(card));
        }
    }
}

export class Skeletor extends CardController {
    Name = "Telescore";
    Cost = 4;
    Power = 0;
    Text = "Once: Change this location to Castle Bonehead";
    Sprite = Sprites.Skeletor;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        const location = this.Location!;
        const location_name = location.Name;
        location.Element.setAttribute("type", LocationType.CantPlayHere.toString());
        yield trace.log(`${location_name} is now ${this.Location}`);
        // Reveal the new location.
        yield* location.Element.Instance.Reveal(trace);
    }
}

export class CartoonVillainsController extends ActorController {
    Type = "villain" as const;
    Name = "Cartoon Villains";
    Sprite = Sprites.Joker;
    Description = "We may be drawn, but we are dangerous!";

    *StartBattle(trace: Trace) {
        const deck = this.Element.querySelector("a-deck")!;
        const cardDistribution = {
            [Sprites.DaltonBro]: 5,
            [Sprites.MojoJojo]: 3,
            [Sprites.Skeletor]: 2,
            [Sprites.Joker]: 1,
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
