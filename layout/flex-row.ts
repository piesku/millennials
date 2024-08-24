customElements.define(
    "flex-row",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            this.shadowRoot!.innerHTML = `
                <style>
                    :host {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                    }

                    :host([wrap]) {
                        flex-wrap: wrap;
                    }

                    :host([reverse]) {
                        flex-direction: row-reverse;
                    }

                    :host([center]) {
                        justify-content: center;
                        align-items: center;
                    }

                    :host([start]) {
                        justify-content: flex-start;
                    }

                    :host([end]) {
                        justify-content: flex-end;
                    }
                </style>
                <slot></slot>
            `;
        }
    },
);
