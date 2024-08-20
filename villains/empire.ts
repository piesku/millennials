import {ActorController} from "../controllers/ActorController.js";
import {CardController} from "../controllers/CardController.js";
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
        Name = "Raintrooper";
        Cost = 2;
        Power = 1;
        Text = `Once: +1 for each revealed ${this.Name}`;
        Sprite = Sprites.Stormtrooper;
        override *OnReveal() {
            const revealedCards = this.Battle.GetRevealedCards();
            const sameNameCards = revealedCards.filter((card) => card.Name === this.Name);
            const count = sameNameCards.length;
            yield `There are ${count} ${this.Name} cards revealed`;
            this.AddModifier(this, "addpower", count);
        }
    },
);

customElements.define(
    "empire-controller",
    class extends ActorController {
        Name = "Empire";
        Description = "The Empire is a powerful force that seeks to control the galaxy";

        *StartBattle() {
            const deck = this.querySelector("a-deck")!;
            const cardDistribution = {
                "storm-trooper": 11,
                "darth-vader": 1,
            };

            for (const [card, count] of Object.entries(cardDistribution)) {
                for (let i = 0; i < count; i++) {
                    deck.appendChild(document.createElement(card));
                }
            }

            for (let i = 0; i < 3; i++) {
                yield* this.DrawCard();
            }
        }
    },
);
