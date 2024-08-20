import {ActorController} from "../controllers/ActorController.js";
import {BattleController} from "../controllers/BattleController.js";
import {CardController} from "../controllers/CardController.js";
import {CardElement} from "../elements/a-card.js";
import {LocationElement} from "../elements/a-location.js";
import {LocationSlot} from "../elements/location-slot.js";
import {element} from "../lib/random.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "darth-vader",
    class extends CardController {
        Name = "Varth Dader";
        Cost = 5;
        Power = 8;
        Text = "";
        Sprite = Sprites.DarthVader;
    },
);

customElements.define(
    "storm-trooper",
    class extends CardController {
        Name = "Raintroopers";
        Cost = 1;
        Power = 2;
        Text = "";
        Sprite = Sprites.Stormtrooper;
    },
);

customElements.define(
    "empire-controller",
    class extends ActorController {
        Name = "Empire";
        Description = "The Empire is a powerful force that seeks to control the galaxy";

        *StartBattle() {
            let cards = ["darth-vader", "storm-trooper"];

            const deck = this.querySelector("a-deck")!;
            for (let i = 0; i < 12; i++) {
                const card = element(cards);
                deck.appendChild(document.createElement(card));
            }

            for (let i = 0; i < 3; i++) {
                yield* this.DrawCard();
            }
        }

        override *RivalAI() {
            // TODO Pick a card that can be played this turn given its cost.
            // TODO Add a while loop.
            let card = element(this.querySelectorAll<CardElement>("a-hand a-card")).Controller;

            let battle = this.closest<BattleController>("battle-controller")!;
            let empty_slots = battle.querySelectorAll<LocationSlot>(
                "location-owner[slot=rival] location-slot:not(:has(a-card))",
            );
            let slot = element(empty_slots);
            let location = slot.closest<LocationElement>("a-location")!.Controller;
            yield `rival plays ${card.Name} to ${location.Name}`;
            slot.appendChild(card);
            battle.PlayedCardsQueue.push(card);
        }
    },
);
