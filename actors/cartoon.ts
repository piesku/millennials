import {CardController} from "../cards/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {ActorController} from "./ActorController.js";

export class DaltonBro extends CardController {
    Name = "Palton Brother";
    Cost = 1;
    Power = 3;
    Text = `Once: Give all the other revealed ${this.Name}s +1 Power`;
    Sprite = Sprites.DaltonBro;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        const other_dalton_cards = [
            ...this.Battle.GetRevealedCards(this.Owner),
            ...this.Battle.GetRevealedCards(this.Opponent),
        ].filter((card) => card.Name === this.Name);
        for (const card of other_dalton_cards) {
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
        if (opponent_hand.length > 0) {
            const card_to_transform = element(opponent_hand);
            const old_card_name = card_to_transform.Instance.Name;
            card_to_transform.setAttribute("type", Sprites.Marble.toString());
            yield trace.log(`Transformed ${old_card_name} into a ${card_to_transform.Instance}`);
        } else {
            yield trace.log("Opponent has no cards in hand to transform");
        }
    }
}

export class Joker extends CardController {
    Name = "Poker";
    Cost = 4;
    Power = 7;
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
    Cost = 5;
    Power = 5;
    Text = "";
    Sprite = Sprites.Skeletor;
    override IsVillain = true;
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
            [Sprites.Joker]: 3,
            [Sprites.Skeletor]: 1,
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
