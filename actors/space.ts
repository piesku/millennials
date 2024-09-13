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
    Description = "Once: -1 Power to all opponent's cards";
    Sprite = Sprites.DarthVader;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        const opponent_cards = this.Battle.GetRevealedCards(this.Opponent);
        for (let card of opponent_cards) {
            yield trace.Log(card.AddModifier(this, "addpower", -1));
        }
    }
}

export class Alien extends CardController {
    Name = "Foreign";
    Cost = 3;
    Power = 6;
    Description = "Once: Trash an opponent's card from here";
    Sprite = Sprites.Alien;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        const opponent_cards = this.Field!.GetRevealedCards(this.Opponent);
        const card = element(opponent_cards);

        if (card) {
            yield* card.Trash(trace);
        }
    }
}

export class Borg extends CardController {
    Name = "Brog";
    Cost = 4;
    Power = 0;
    Description = "Once: +1 Cost to all cards in opponent's hand";
    Sprite = Sprites.Borg;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        for (let card of this.Opponent.Hand.querySelectorAll<CardElement>("a-card")) {
            yield trace.Log(card.Controller.AddModifier(this, "addcost", 1));
        }
    }
}

export class Stormtrooper extends CardController {
    Name = "Raintrooper";
    Cost = 2;
    Power = 1;
    Description = `Once: +1 for each revealed ${this.Name}`;
    Sprite = Sprites.Stormtrooper;
    override IsVillain = true;
    override *OnReveal(trace: Trace) {
        const revealedCards = this.Battle.GetRevealedCards();
        const sameNameCards = revealedCards.filter((card) => card.Name === this.Name);
        const count = sameNameCards.length;
        yield trace.Log(this.AddModifier(this, "addpower", count));
    }
}

export class SpaceVillainsController extends ActorController {
    Type = "villain" as const;
    Name = "Space Villains";
    Sprite = Sprites.DarthVader;
    Description = "Space Villains seek to control the galaxy";
    StartingDeck = [
        Sprites.Stormtrooper,
        Sprites.Stormtrooper,
        Sprites.Stormtrooper,
        Sprites.Stormtrooper,
        Sprites.Stormtrooper,
        Sprites.Stormtrooper,
        Sprites.Stormtrooper,
        Sprites.Alien,
        Sprites.Alien,
        Sprites.Borg,
        Sprites.Borg,
        Sprites.DarthVader,
    ];
}
