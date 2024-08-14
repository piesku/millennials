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
            const power = this.getAttribute("power") ?? "";
            const text = this.getAttribute("text") ?? "";
            const imageIndex = parseInt(this.getAttribute("image") ?? "0", 10);
            const spriteSize = 16;
            const spriteMargin = 1;
            const targetSize = 120;
            const scale = targetSize / spriteSize;

            const spriteYPosition = (spriteSize + spriteMargin) * imageIndex * scale;

            this.shadowRoot!.innerHTML = `
              <style>
                :host {
                  display: block;
                  width: 120px;
                  height: 180px;
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
                  background-size: ${targetSize}px auto;
                  image-rendering: pixelated;
                  margin: 0 auto;
                }

                .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  font-size: 0.8em;
                  font-family: Arial, sans-serif;
                  margin-bottom: 5px;
                  padding: 0 2px;
                }

                .header span {
                  font-weight: bold;
                  font-size: 20px;
                }

                .header span:nth-child(2) {
                  flex-grow: 1;
                  text-align: center;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  max-width: ${targetSize - 8}px;
                  font-size: 14px;
                }

                .description {
                  text-align: center;
                  font-family: Arial, sans-serif;
                  font-size: 0.9em;
                }
              </style>

              <flex-col>
                <div class="header">
                  <span>${cost}</span>
                  <span>${name}</span>
                  <span>${power}</span>
                </div>
                <div class="sprite"></div>
                <div class="description">
                  ${text}
                </div>
              </flex-col>
            `;
        }
    },
);
