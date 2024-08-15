import {Sprites} from "../sprites/sprites.js";
import {Card} from "./Card.js";

customElements.define(
    "ne-o",
    class extends Card {
        Name = "Neo";
        Cost = 4;
        Power = 6;
        Text = "The One";
        Sprite = Sprites.Neo;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("Neo enters the table");
                    break;
            }
        }
    },
);
