import "./elements/a-card.js";
import "./elements/a-hand.js";
import "./elements/a-table.js";
import "./layout/flex-col.js";
import "./layout/flex-row.js";

import "./cards/forrest-gump.js";

const hand = document.querySelector("a-hand")!;

for (let i = 0; i < 5; i++) {
    hand.appendChild(document.createElement("forrest-gump"));
}
