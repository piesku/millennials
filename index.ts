import "./elements/a-card.js";
import "./elements/a-hand.js";
import "./elements/a-location.js";
import "./elements/a-table.js";

import "./layout/flex-col.js";
import "./layout/flex-row.js";

import "./cards/bat-man.js";
import "./cards/forrest-gump.js";
import "./cards/harry-potter.js";
import "./cards/luke-skywalker.js";
import "./cards/marty-mcfly.js";
import "./cards/ne-o.js";
import "./cards/obi-wan-kenobi.js";
import "./cards/robin-hood.js";
import "./cards/robo-cop.js";
import "./cards/super-man.js";
import "./cards/tmnt-donatello.js";
import "./cards/tmnt-leonardo.js";
import "./cards/tmnt-michaelangelo.js";
import "./cards/tmnt-raphael.js";

import "./cards/enemies/empire.js";

import "./locations/arkham-asylum.js";
import "./locations/death-star.js";
import "./locations/future-hill-valley.js";

import {element, set_seed} from "./lib/random.js";

const hand = document.querySelector("a-hand")!;

set_seed(Math.random());
const elements = [
    "forrest-gump",
    "robin-hood",
    "marty-mcfly",
    "super-man",
    "obi-wan-kenobi",
    "harry-potter",
    "bat-man",
    "ne-o",
    "luke-skywalker",
    "robo-cop",
    "tmnt-leonardo",
    "tmnt-michaelangelo",
    "tmnt-donatello",
    "tmnt-raphael",
];

for (let i = 0; i < 8; i++) {
    hand.appendChild(document.createElement(element(elements)));
}

const table = document.querySelector("a-table")!;
const locations = ["death-star", "arkham-asylum", "future-hill-valley"];
for (let i = 0; i < locations.length; i++) {
    table.appendChild(document.createElement(locations[i]));
}

const enemies = [
    {type: "darth-vader", count: 1},
    {type: "storm-trooper", count: 3},
];

for (let i = 0; i < enemies.length; i++) {
    for (let j = 0; j < enemies[i].count; j++) {
        const randomLocation = element(locations);
        const locationElement = document.querySelector(randomLocation)!;
        const enemyDropZone = locationElement.children[0].shadowRoot!.querySelector("#enemy-drop-area")!;

        enemyDropZone.appendChild(document.createElement(enemies[i].type));
    }
}
