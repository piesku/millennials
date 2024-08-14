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
            const imageIndex = parseInt(this.getAttribute("image") ?? "0", 10);
            const spriteSize = 16;
            const spriteMargin = 1;
            const targetSize = 64;
            const scale = targetSize / spriteSize;

            const spriteYPosition = (spriteSize + spriteMargin) * imageIndex * scale;

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
                  position: relative;
                  overflow: hidden;
                }

                :host(.dragging) {
                  opacity: 0.5;
                }

                .sprite {
                  width: ${targetSize}px;
                  height: ${targetSize}px;
                  background-image: url('/sprites/spritesheet.png.webp');
                  background-position: 0 -${spriteYPosition}px;
                  background-size: 64px auto;
                  image-rendering: pixelated;
                  margin: 0 auto;
                }
              </style>

              <flex-col>
                <flex-row>
                  <span>${cost}</span>
                </flex-row>
                <div class="sprite"></div>
                <div>
                  ${name}
                  ${text}
                </div>
              </flex-col>
            `;
        }
    },
);
