import {CardController} from "../cards/CardController.js";
import {MacGyver} from "../cards/mac-gyver.js";
import {CardElement} from "../elements/a-card.js";
import {element} from "../lib/random.js";
import {LocationType} from "../locations/LocationController.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {ActorController} from "./ActorController.js";

export class DaltonBro extends CardController {
    Name = "Palton Brother";
    Cost = 1;
    Power = 2;
    Description = `Once: +1 Power to another ${this.Name}`;
    Sprite = Sprites.DaltonBro;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        const other_dalton_cards = [...this.Battle.GetRevealedCards()].filter((card) => card.Name === this.Name);

        const card = element(other_dalton_cards);
        if (card) {
            yield trace.Log(card.AddModifier(this, "addpower", 1));
        }
    }
}

export class MojoJojo extends CardController {
    Name = "DojoBojo";
    Cost = 3;
    Power = 6;
    Description = "Once: Turn a card in the opponent's hand into a Marble";
    Sprite = Sprites.MojoJojo;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        let opponent_hand = this.Opponent.Hand.querySelectorAll<CardElement>("a-card");
        let card_to_transform = element(opponent_hand);
        if (card_to_transform) {
            let old_card_instance = card_to_transform.Controller;
            card_to_transform.setAttribute("type", Sprites.Marble.toString());
            yield trace.Log(`${old_card_instance} is now a ${card_to_transform.Controller}!`);
        }
    }
}

export class Joker extends MacGyver {
    override Name = "Poker";
    override Cost = 5;
    override Power = 0;
    override Sprite = Sprites.Joker;
    override IsVillain = true;
}

export class Skeletor extends CardController {
    Name = "Telescore";
    Cost = 4;
    Power = 0;
    Description = "Once: Lock this location down";
    Sprite = Sprites.Skeletor;
    override IsVillain = true;
    override SpriteOffset = 1;

    override *OnReveal(trace: Trace) {
        const location = this.Field!;
        const location_name = location.Name;
        location.Element.setAttribute("type", LocationType.CantPlayHere.toString());
        yield trace.Log(`${location_name} is now locked down!`);
        // Reveal the new location.
        yield* location.Element.Controller.Reveal(trace);
    }
}

export class CartoonVillainsController extends ActorController {
    Type = "villain" as const;
    Name = "Cartoon Villains";
    Sprite = Sprites.Joker;
    Description = "We may be drawn, but we are dangerous!";
    StartingDeck = [
        Sprites.DaltonBro,
        Sprites.DaltonBro,
        Sprites.DaltonBro,
        Sprites.DaltonBro,
        Sprites.DaltonBro,
        Sprites.MojoJojo,
        Sprites.MojoJojo,
        Sprites.MojoJojo,
        Sprites.Skeletor,
        Sprites.Skeletor,
        Sprites.Joker,
    ];
}
