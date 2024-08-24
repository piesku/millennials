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
            let card = document.createElement("a-card");
            card.setAttribute("type", card_type.toString());
            deck.appendChild(card);
        }

        for (let i = 0; i < 3; i++) {
            yield* this.DrawCard();
        }
    }
}
