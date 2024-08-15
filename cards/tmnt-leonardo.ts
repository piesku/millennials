import {Sprites} from "../sprites/sprites.js";
import {Card} from "./Card.js";

customElements.define(
    "tmnt-leonardo",
    class extends Card {
        Name = "Leonardo";
        Cost = 3;
        Power = 5;
        Text = "Leader of the Teenage Mutant Ninja Turtles";
        Sprite = Sprites.Leonardo;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("Leonardo enters the table");
                    break;
            }
        }
    },
);
