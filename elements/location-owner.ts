import {html} from "../lib/html.js";

export class LocationOwner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <flex-row
                wrap
                ${this.getAttribute("reverse") !== null && "reverse"}
                style="justify-content: space-between; align-content: center;"
            >
                <slot></slot>
            </flex-row>
        `;
    }
}
customElements.define("location-owner", LocationOwner);
