import {CardController} from "../../controllers/CardController.js";
import {Sprites} from "../../sprites/sprites.js";

customElements.define(
    "darth-vader",
    class extends CardController {
        Name = "Varth Dader";
        Cost = 5;
        Power = 8;
        Text = "";
        Sprite = Sprites.DarthVader;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);

customElements.define(
    "storm-trooper",
    class extends CardController {
        Name = "Raintroopers";
        Cost = 1;
        Power = 2;
        Text = "";
        Sprite = Sprites.Stormtrooper;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
