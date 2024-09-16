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
                }

                slot::slotted(*) {
                    margin: 0 -115px 0 0;
                }

                :host([reverse]) slot::slotted(*) {
                    margin: 0 0 0 -115px;
                }
            </style>
            <flex-row start ${this.getAttribute("reverse") !== null && "reverse"}>
                <slot></slot>
            </flex-row>
        `;
    }
}

customElements.define("a-deck", DeckElement);
