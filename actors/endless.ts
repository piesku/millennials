import {ActorElement} from "../elements/a-actor.js";
import {GameContainer} from "../elements/game-container.js";
import {element} from "../lib/random.js";
import {Sprites} from "../sprites/sprites.js";
import {ActorController} from "./ActorController.js";

export class EndlessController extends ActorController {
    Type = "villain" as const;
    Name: string;
    Sprite: Sprites;
    Description: string;
    StartingDeck: Array<Sprites>;

    constructor(actor_element: ActorElement) {
        super(actor_element);

        let game = document.querySelector<GameContainer>("g-c");
        DEBUG: if (!game) {
            throw "Actor must be inside a game";
        }

        let avatar = element(game.Collection.AllCards);

        this.Sprite = avatar.Sprite;
        this.Name = `Evil ${avatar.Name}`;
        this.Description = `${this.Name} has joined the villains!`;

        let all = game.Collection.AllCardsByCost();

        this.StartingDeck = [
            avatar.Sprite,

            element(all[1]!).Sprite,
            element(all[1]!).Sprite,
            element(all[2]!).Sprite,
            element(all[2]!).Sprite,
            element(all[3]!).Sprite,
            element(all[3]!).Sprite,
            element(all[4]!).Sprite,
            element(all[4]!).Sprite,
            element(all[5]!).Sprite,
            element(all[5]!).Sprite,
            element(all[6]!).Sprite,
        ];
    }
}
