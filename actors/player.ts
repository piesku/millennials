import {CardElement} from "../elements/a-card.js";
import {GameContainer} from "../elements/game-container.js";
import {shuffle} from "../lib/random.js";
import {ActorController} from "./ActorController.js";

export class PlayerController extends ActorController {
    Type = "player" as const;
    Name = "You";

    *StartBattle() {
        let game = this.Element.closest("game-container") as GameContainer;
        let cards = [...game.PlayerDeck];

        const deck = this.Element.querySelector("a-deck")!;
        for (let card_type of shuffle(cards)) {
            let card = document.createElement("a-card") as CardElement;
            card.setAttribute("type", card_type.toString());
            card.setAttribute("draggable", "true");

            card.addEventListener("dragstart", (e) => {
                let card = e.target as CardElement;

                const energy_left = card.Instance.Owner.CurrentEnergy;
                const card_cost = card.Instance.CurrentCost;
                if (card_cost > energy_left) {
                    e.preventDefault();
                    return false;
                }

                if (e.dataTransfer) {
                    e.dataTransfer.setData("text/plain", card.id);
                    card.classList.add("dragging");
                }
            });

            card.addEventListener("dragend", (e) => {
                let card = e.target as HTMLElement;
                card.classList.remove("dragging");
            });

            deck.appendChild(card);
        }

        for (let i = 0; i < 3; i++) {
            yield* this.DrawCard();
        }
    }
}
