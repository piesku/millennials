import {BattleController} from "../controllers/battle-controller.js";
import {html} from "../lib/html.js";

export class TableElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <flex-col style="justify-content: center;">
                <button>End Turn</button>
                <slot></slot>
            </flex-col>
        `;

        this.shadowRoot!.querySelector("button")!.addEventListener("click", () => {
            // this.dispatchEvent(new CustomEvent("end-turn"));

            let battle = this.closest("battle-controller")! as BattleController;
            battle.RunEndTurn();
        });
    }
}
customElements.define("a-table", TableElement);
