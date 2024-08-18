import {html} from "../lib/html.js";

export class TableElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <flex-col style="justify-content: center;">
                <button id="end">End Turn</button>
                <slot></slot>
            </flex-col>
        `;

        this.shadowRoot!.querySelector("button")!.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("end-turn-clicked", {bubbles: true, composed: true}));
        });
    }
}
customElements.define("a-table", TableElement);
