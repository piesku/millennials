import {Sprites} from "../sprites/sprites.js";
import {Card} from "./Card.js";

customElements.define(
    "tmnt-donatello",
    class extends Card {
        Name = "Donatello";
        Cost = 3;
        Power = 5;
        Text = "The brains of the Teenage Mutant Ninja Turtles";
        Sprite = Sprites.Donatello;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("Donatello enters the table");
                    break;
            }
        }
    },
);
