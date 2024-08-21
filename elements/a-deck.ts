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
                }

                slot::slotted(*) {
                    margin-right: -115px;
                }

                :host([reverse]) slot::slotted(*) {
                    margin-right: 0;
                    margin-left: -115px;
                }
            </style>
            <flex-row ${this.getAttribute("reverse") !== null && "reverse"}>
                <slot></slot>
            </flex-row>
        `;
    }
}

customElements.define("a-deck", DeckElement);
