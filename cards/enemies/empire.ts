import {Sprites} from "../../sprites/sprites.js";
import {Card} from "../Card.js";

customElements.define(
    "darth-vader",
    class extends Card {
        Name = "Darth Vader";
        Cost = 5;
        Power = 8;
        Text = "I am your father";
        Sprite = Sprites.DarthVader;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("Darth Vader enters the table");
                    break;
            }
        }
    },
);

customElements.define(
    "storm-trooper",
    class extends Card {
        Name = "Stormtrooper";
        Cost = 1;
        Power = 2;
        Text = "For the Empire!";
        Sprite = Sprites.Stormtrooper;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("Stormtrooper enters the table");
                    break;
            }
        }
    },
);
