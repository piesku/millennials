import "./elements/a-card.js";
import "./elements/a-hand.js";
import "./layout/flex-col.js";
import "./layout/flex-row.js";

import "./cards/forrest-gump.js";

const hand = document.querySelector("a-hand")!;
const table = document.querySelector("a-table")!;

// Deal 5 cards to the hand
for (let i = 0; i < 5; i++) {
    hand.appendChild(document.createElement("forrest-gump"));
}

// Set up the table as a drop zone
table.addEventListener("dragover", (e) => {
    e.preventDefault();
});

table.addEventListener("drop", (e) => {
    e.preventDefault();
    let drag = e as DragEvent;
    if (drag.dataTransfer) {
        const card_id = drag.dataTransfer.getData("text");
        const card = document.getElementById(card_id);
        if (card) {
            table.appendChild(card);
            card.style.position = "absolute";
            card.style.left = `${drag.clientX - 40}px`;
            card.style.top = `${drag.clientY - 60}px`;
        }
    }
});
