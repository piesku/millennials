import {Sprites} from "../sprites/sprites.js";
import {Card} from "./Card.js";

customElements.define(
    "robo-cop",
    class extends Card {
        Name = "Robocop";
        Cost = 2;
        Power = 4;
        Text = "Part man, part machine, all cop";
        Sprite = Sprites.Robocop;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("Robocop enters the table");
                    break;
            }
        }
    },
);
