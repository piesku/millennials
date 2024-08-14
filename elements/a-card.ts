customElements.define(
    "a-card",
    class extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            const name = this.getAttribute("name") ?? "";
            const cost = this.getAttribute("cost") ?? "";
            const text = this.getAttribute("text") ?? "";

            this.innerHTML = `
        <style>
            :host {
                display: inline-block;
                width: 60px;
                height: 100px;
                background-color: white;
                border: 1px solid black;
                border-radius: 10px;
                text-align: center;
                font-size: 24px;
                line-height: 100px;
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

            this.addEventListener("dragstart", (e) => {
                let target = e.target as HTMLElement;
                if (e.dataTransfer) {
                    e.dataTransfer.setData("text/plain", target.id);
                    target.classList.add("dragging");
                }
            });

            this.addEventListener("dragend", (e) => {
                let target = e.target as HTMLElement;
                target.classList.remove("dragging");
            });
        }
    },
);
