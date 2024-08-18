import {html} from "../lib/html.js";

export class DeckElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                    height: 200px;
                    background-color: #1c5a1c;
                    padding: 10px;
                }

                slot::slotted(*) {
                    margin-right: -115px;
                }
            </style>
            <flex-row>
                <slot></slot>
            </flex-row>
        `;
    }
}

customElements.define("a-deck", DeckElement);
