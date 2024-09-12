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
    Text = `Once: Give another ${this.Name} +1 Power`;
    Sprite = Sprites.DaltonBro;
    override IsVillain = true;

    override *OnReveal(trace: Trace) {
        const other_dalton_cards = this.Battle.GetRevealedCards().filter((card) => card.Name === this.Name);

        const card = element(other_dalton_cards);
        if (card) {
            yield trace.log(card.AddModifier(this, "addpower", 1));
        }
    }
}

export class MojoJojo extends CardController {
    Name = "DojoBojo";
    Cost = 3;
    Power = 6;
    Text = "Once: Turn a card in the opponent's into a Marble";
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

export class Joker extends MacGyver {
    override Name = "Poker";
    override Cost = 5;
    override Power = 0;
    override Text = "Once: Repeat the Once abilities of all your revealed cards.";
    override Sprite = Sprites.Joker;
    override IsVillain = true;
}

export class Skeletor extends CardController {
    Name = "Telescore";
    Cost = 4;
    Power = 0;
    Text = "Once: Change this location to Castle Bonehead";
    Sprite = Sprites.Skeletor;
    override IsVillain = true;
    override SpriteOffset = 1;

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
