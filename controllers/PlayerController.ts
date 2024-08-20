import {element} from "../lib/random.js";
import {ActorController} from "./ActorController.js";

export class PlayerController extends ActorController {
    Name = "You";

    *StartBattle() {
        const cards = [
            "a-baracus",
            "a-faceman",
            "a-hannibal",
            "a-murdock",
            "bat-man",
            "bla-de",
            "buzz-lightyear",
            "denver-dinosaur",
            "forrest-gump",
            "harry-potter",
            "hermi-one",
            "homer-simpson",
            "indiana-jones",
            "james-bond",
            "kre-cik",
            "luke-skywalker",
            "mac-gyver",
            "marty-mcfly",
            "mor-ty",
            "mufa-sa",
            "ne-o",
            "obi-wan-kenobi",
            "rick-sanchez",
            "robin-hood",
            "robo-cop",
            "ron-wesley",
            "sim-ba",
            "super-man",
            "tmnt-donatello",
            "tmnt-leonardo",
            "tmnt-michaelangelo",
            "tmnt-raphael",
            "woo-dy",
        ];

        const deck = this.querySelector("a-deck")!;
        for (let i = 0; i < 12; i++) {
            const card = element(cards);
            deck.appendChild(document.createElement(card));
        }

        for (let i = 0; i < 3; i++) {
            yield* this.DrawCard();
        }
    }
}

customElements.define("player-controller", PlayerController);
