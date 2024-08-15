import {Sprites} from "../sprites/sprites.js";
import {Card} from "./Card.js";

customElements.define(
    "obi-wan-kenobi",
    class extends Card {
        Name = "Obi-Wan Kenobi";
        Cost = 3;
        Power = 5;
        Text = "Hello there!";
        Sprite = Sprites.ObiWanKenobi;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("Obi-Wan Kenobi enters the table");
                    break;
            }
        }
    },
);
