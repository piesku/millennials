customElements.define(
    "a-card",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            const name = this.getAttribute("name") ?? "";
            const cost = this.getAttribute("cost") ?? "";
            const text = this.getAttribute("text") ?? "";

            this.shadowRoot!.innerHTML = `
              <style>
                :host {
                  display: block;
                  width: 80px;
                  height: 120px;
                  background-color: white;
                  border: 1px solid black;
                  border-radius: 5px;
                  margin: 0 5px;
                  cursor: move;
                  user-select: none;
                }

                :host(.dragging) {
                  opacity: 0.5;
                }
              </style>

              <flex-col>
                <flex-row>
                  <span>${cost}</span>
                </flex-row>
                <div>
                  ${name}
                  ${text}
                </div>
              </flex-col>
            `;
        }
    },
);
