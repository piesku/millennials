import {Sprites} from "../sprites/sprites.js";
import {Card} from "./Card.js";

customElements.define(
    "marty-mcfly",
    class extends Card {
        override render() {
            return `
                <a-card name="Marty McFly" cost="1" power="3" text="Alzheimer, I'm in you!" image="${Sprites.MartyMcFly}"></a-card>
            `;
        }

        override handleEvent(event: Event) {
            switch (event.type) {
                case "CardEntersTable":
                    console.log("CardEntersTable");
                    break;
            }
        }
    },
);
