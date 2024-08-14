import "./elements/a-card.js";
import "./elements/a-hand.js";
import "./elements/a-table.js";
import "./layout/flex-col.js";
import "./layout/flex-row.js";

import "./cards/forrest-gump.js";
import "./cards/marty-mcfly.js";
import "./cards/robin-hood.js";
import {element} from "./lib/random.js";

const hand = document.querySelector("a-hand")!;

const elements = ["forrest-gump", "robin-hood", "marty-mcfly"];
for (let i = 0; i < 5; i++) {
    hand.appendChild(document.createElement(element(elements)));
}
