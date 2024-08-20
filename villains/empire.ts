import {ActorController} from "../controllers/ActorController.js";
import {CardController} from "../controllers/CardController.js";
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

        // override *RivalAI() {

        // }
    },
);
