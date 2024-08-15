import {Sprites} from "../sprites/sprites.js";
import {Card} from "./Card.js";

customElements.define(
    "forrest-gump",
    class extends Card {
        Name = "Forrest Gump";
        Cost = 3;
        Power = 2;
        Text = "Run Forrest, Run!";
        Sprite = Sprites.ForrestGump;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("CardEntersTable");
                    break;
            }
        }
    },
);
