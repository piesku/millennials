import {CardController} from "../cards/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {ActorController} from "./ActorController.js";

export class DarthVader extends CardController {
    Name = "Varth Dader";
    Cost = 5;
    Power = 8;
    Text = "Once: Reduce the power of all opponent's cards in play by 1";
    Sprite = Sprites.DarthVader;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        const opponent_cards = this.Location?.GetRevealedCards(this.Opponent) || [];
        for (let card of opponent_cards) {
            yield trace.log(card.AddModifier(this, "addpower", -1));
        }
    }
}

export class Dalek extends CardController {
    Name = "Kalek";
    Cost = 1;
    Power = 2;
    Text = "Once: Give a random opponent cart in this location -1 Power. EXTERMINATE!";
    Sprite = Sprites.Dalek;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        const opponent_cards = this.Location?.GetRevealedCards(this.Opponent) || [];
        const card = element(opponent_cards);

        if (card) {
            yield trace.log(card.AddModifier(this, "addpower", -1));
        }
    }
}

export class Alien extends CardController {
    Name = "Foreign";
    Cost = 3;
    Power = 6;
    Text = "Once: Return a random opponent's card from this location back to his hand";
    Sprite = Sprites.Alien;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        const opponent_cards = this.Location?.GetRevealedCards(this.Opponent) || [];
        const card = element(opponent_cards);

        if (card) {
            yield trace.log(`${this.Name} returns ${card.Name} to opponent's hand`);
            card.TurnPlayed = 0;
            this.Opponent.Hand.appendChild(card.Element);
        }
    }
}

export class Borg extends CardController {
    Name = "Brog";
    Cost = 4;
    Power = 11;
    Text = "Once: Give +1 Cost to all cards in opponent's hand";
    Sprite = Sprites.Borg;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        const hand = this.Opponent.Element.querySelector("a-hand")!;
        for (let card of hand.querySelectorAll<CardElement>("a-card")) {
            yield trace.log(card.Instance.AddModifier(this, "addcost", 1));
        }
    }
}

export class Stormtrooper extends CardController {
    Name = "Raintrooper";
    Cost = 2;
    Power = 1;
    Text = `Once: +1 for each revealed ${this.Name}`;
    Sprite = Sprites.Stormtrooper;
    override IsVillain = true;
    override *OnReveal(trace: Trace) {
        const revealedCards = this.Battle.GetRevealedCards();
        const sameNameCards = revealedCards.filter((card) => card.Name === this.Name);
        const count = sameNameCards.length;
        yield trace.log(this.AddModifier(this, "addpower", count));
    }
}

export class EmpireController extends ActorController {
    Type = "villain" as const;
    Name = "Space Villains";
    Sprite = Sprites.DarthVader;
    Description = "Space Villains seek to control the galaxy";

    *StartBattle(trace: Trace) {
        const deck = this.Element.querySelector("a-deck")!;
        const cardDistribution = {
            [Sprites.Stormtrooper]: 4,
            [Sprites.Dalek]: 3,
            [Sprites.Alien]: 2,
            [Sprites.Borg]: 2,
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
