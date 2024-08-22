import {element} from "../lib/random.js";
import {Sprites} from "../sprites/sprites.js";
import {ActorController} from "./ActorController.js";

export class PlayerController extends ActorController {
    Type = "player" as const;
    Name = "You";

    *StartBattle() {
        const cards = [
            Sprites.BABaracus,
            Sprites.Faceman,
            Sprites.Hannibal,
            Sprites.Murdock,
            Sprites.Batman,
            Sprites.Blade,
            Sprites.Buzz,
            Sprites.Denver,
            // "forrest-gump",
            // "harry-potter",
            // "hermi-one",
            // "homer-simpson",
            // "indiana-jones",
            // "james-bond",
            // "kre-cik",
            // "luke-skywalker",
            // "mac-gyver",
            // "marty-mcfly",
            // "mor-ty",
            // "mufa-sa",
            // "ne-o",
            // "obi-wan-kenobi",
            // "rick-sanchez",
            // "robin-hood",
            Sprites.Robocop,
            // "ron-wesley",
            // "sim-ba",
            // "super-man",
            // "tmnt-donatello",
            // "tmnt-leonardo",
            // "tmnt-michaelangelo",
            // "tmnt-raphael",
            Sprites.Woody,
        ];

        const deck = this.Element.querySelector("a-deck")!;
        for (let i = 0; i < 12; i++) {
            let card = document.createElement("a-card");
            card.setAttribute("type", element(cards).toString());
            deck.appendChild(card);
        }

        for (let i = 0; i < 3; i++) {
            yield* this.DrawCard();
        }
    }
}
