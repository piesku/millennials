import {CardController} from "../controllers/CardController.js";
import {Sprites} from "../sprites/sprites.js";

customElements.define(
    "a-baracus",
    class extends CardController {
        Name = "B-Team A.B. Bacarus";
        Cost = 2;
        Power = 2;
        Text = "If in the middle location +3 power";
        Sprite = Sprites.BABaracus;

        override *OnReveal() {
            const battle_cotroller = this.closest("battle-controller")!;
            const locations = battle_cotroller.querySelectorAll("a-location");
            let locationIndex = -1;

            for (let index = 0; index < locations.length; index++) {
                if (locations[index].contains(this)) {
                    locationIndex = index;
                    break;
                }
            }

            if (locationIndex === 1) {
                let modifier = document.createElement("a-modifier")!;
                modifier.setAttribute("origin", this.Name);
                modifier.setAttribute("op", "addpower");
                modifier.setAttribute("value", "3");
                this.appendChild(modifier);
                yield `${this.Name} gains +3 power for being in the middle location`;
            } else {
                yield `${this.Name} does not gain any additional power`;
            }
        }
    },
);
