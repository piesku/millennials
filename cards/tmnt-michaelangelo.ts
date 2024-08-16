import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "tmnt-michaelangelo",
    class extends CardController {
        Name = "Michaelangelo";
        Cost = 3;
        Power = 5;
        Text = "The party dude of the Teenage Mutant Ninja Turtles";
        Sprite = Sprites.MichaelAngelo;

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("Michaelangelo enters the table");
                    break;
            }
        }
    },
);
