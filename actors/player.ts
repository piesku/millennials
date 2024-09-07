import {CardElement} from "../elements/a-card.js";
import {HandElement} from "../elements/a-hand.js";
import {GameContainer} from "../elements/game-container.js";
import {shuffle} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {ActorController} from "./ActorController.js";

export const STARTING_DECK = [
    // Sprites.Raphael,
    // Sprites.Raphael,
    // Sprites.Raphael,
    Sprites.Genie,
    Sprites.Genie,
    Sprites.RobinHood,
    Sprites.LuckyLuke,
    Sprites.Goku,
    // Sprites.Superman,
    // Sprites.Superman,
    // Sprites.Hermione,
    // Sprites.Faceman,
    Sprites.Goku,

    Sprites.Beavis,
    Sprites.Krecik,
    Sprites.Beavis,
    Sprites.Butthead,
    Sprites.Krecik,
    Sprites.Butthead,
];

export class PlayerController extends ActorController {
    Type = "player" as const;
    Name = "You";
    Sprite = Sprites.Murdock;
    Description = "The Good Guys";

    *StartBattle(trace: Trace) {
        let game = this.Element.closest("game-container") as GameContainer;
        let cards = [...game.PlayerDeck];

        let hand = this.Element.querySelector("a-hand") as HandElement;
        hand.addEventListener("dragstart", (e) => {
            let card = e.target as CardElement;

            const energy_left = card.Instance.Owner.CurrentEnergy;
            const card_cost = card.Instance.CurrentCost;
            if (card_cost > energy_left) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }

            if (e.dataTransfer) {
                e.dataTransfer.setData("text/plain", card.id);
            }
        });

        let deck = this.Element.querySelector("a-deck")!;
        for (let card_type of shuffle(cards)) {
            let card = document.createElement("a-card") as CardElement;
            card.setAttribute("type", card_type.toString());
            card.setAttribute("draggable", "true");
            deck.appendChild(card);
        }

        for (let i = 0; i < 3; i++) {
            yield* this.DrawCard(trace);
        }
    }
}
