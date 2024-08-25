import {html} from "../lib/html.js";

export class TableElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                }
            </style>
            <flex-col style="justify-content: center;">
                <slot></slot>
            </flex-col>
        `;
    }
}
customElements.define("a-table", TableElement);
