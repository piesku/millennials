import {Sprites} from "../sprites/sprites.js";
import {Card} from "./Card.js";

customElements.define(
    "tmnt-raphael",
    class extends Card {
        Name = "Raphael";
        Cost = 3;
        Power = 5;
        Text = "The muscle of the Teenage Mutant Ninja Turtles";
        Sprite = Sprites.Raphael;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("Raphael enters the table");
                    break;
            }
        }
    },
);
