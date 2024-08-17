import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "forrest-gump",
    class extends CardController {
        Name = "Gorrest Fump";
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
