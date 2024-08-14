customElements.define(
    "a-hand",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            this.shadowRoot!.innerHTML = `
                <flex-row>
                    <slot></slot>
                </flex-row>
            `;
        }
    },
);
