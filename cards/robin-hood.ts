import {Sprites} from "../sprites/sprites.js";
import {Card} from "./Card.js";

customElements.define(
    "robin-hood",
    class extends Card {
        override render() {
            return `
                <a-card name="Robin Hood" cost="1" power="2" text="Coz' he ain't eatin' too much" image="${Sprites.RobinHood}"></a-card>
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
