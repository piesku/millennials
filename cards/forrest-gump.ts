import {Sprites} from "../sprites/sprites.js";
import {Card} from "./Card.js";

customElements.define(
    "forrest-gump",
    class extends Card {
        override render() {
            return `
                <a-card name="Forrest Gump" cost="3" power="2" text="Run Forrest, Run!" image="${Sprites.ForrestGump}"></a-card>
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
