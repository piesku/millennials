customElements.define(
    "a-table",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            this.shadowRoot!.innerHTML = `
                <slot></slot>
            `;

            this.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            this.addEventListener("drop", (e) => {
                e.preventDefault();
                let drag = e as DragEvent;
                if (drag.dataTransfer) {
                    const card_id = drag.dataTransfer.getData("text");
                    const card = document.getElementById(card_id);
                    if (card) {
                        this.appendChild(card);
                        card.style.position = "absolute";
                        card.style.left = `${drag.clientX - 40}px`;
                        card.style.top = `${drag.clientY - 60}px`;
                    }
                }
            });
        }
    },
);
