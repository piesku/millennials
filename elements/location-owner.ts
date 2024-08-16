import {html} from "../lib/html.js";

customElements.define(
    "location-owner",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            const reverse = this.getAttribute("reverse") !== null;
            this.shadowRoot!.innerHTML = html`
                <flex-row wrap ${reverse && "reverse"} style="justify-content: space-between; align-content: center;">
                    <slot></slot>
                </flex-row>
            `;
        }
    },
);
