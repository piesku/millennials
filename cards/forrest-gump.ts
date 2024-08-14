import {Card} from "./Card.js";

customElements.define(
    "forrest-gump",
    class extends Card {
        override render() {
            return `
                <a-card name="Forrest Gump" cost="3" text="Hi!"></a-card>
            `;
        }
    },
);
