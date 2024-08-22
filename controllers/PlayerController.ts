import {shuffle} from "../lib/random.js";
import {ActorController} from "./ActorController.js";
import {GameController} from "./GameController.js";

export class PlayerController extends ActorController {
    Type = "player" as const;
    Name = "You";

    *StartBattle() {
        let game = this.Element.closest("game-controller") as GameController;
        let cards = game.getAttribute("cards")!.split(",");

        const deck = this.Element.querySelector("a-deck")!;
        for (let card_type of shuffle(cards)) {
            let card = document.createElement("a-card");
            card.setAttribute("type", card_type);
            deck.appendChild(card);
        }

        for (let i = 0; i < 3; i++) {
            yield* this.DrawCard();
        }
    }
}
