import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "luke-skywalker",
    class extends CardController {
        Name = "Suke Lywalker";
        Cost = 3;
        Power = 5;
        Text = "The Force is strong with this one";
        Sprite = Sprites.LukeSkywalker;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log(`${this.Name} enters the table`);
                    break;
            }
        }
    },
);
