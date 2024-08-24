customElements.define(
    "flex-col",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            this.shadowRoot!.innerHTML = `
                <style>
                    :host {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }

                    :host([wrap]) {
                        flex-wrap: wrap;
                    }

                    :host([reverse]) {
                        flex-direction: column-reverse;
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
