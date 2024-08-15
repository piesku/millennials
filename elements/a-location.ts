customElements.define(
    "a-location",
    class extends HTMLElement {
        playerPoints: number = 0;
        enemyPoints: number = 0;

        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            this.shadowRoot!.innerHTML = `
                <style>
                    .location {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        border: 1px solid #000;
                        padding: 10px;
                        margin: 10px;
                    }
                    .description {
                        margin: 10px 0;
                    }
                    .drop-zone {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                    }
                    .drop-area {
                        border: 1px dashed #000;
                        width: 45%;
                        min-height: 100px;
                        display: flex;
                        flex-wrap: wrap;
                    }
                    .points {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        margin-top: 10px;
                    }
                </style>
                <div class="location">
                    <div class="description">
                        <slot name="description"></slot>
                    </div>
                    <div class="drop-zone">
                        <div class="drop-area" id="player-drop-area"></div>
                        <div class="drop-area" id="enemy-drop-area"></div>
                    </div>
                    <div class="points">
                        <div>Player Points: <span id="player-points">${this.playerPoints}</span></div>
                        <div>Enemy Points: <span id="enemy-points">${this.enemyPoints}</span></div>
                    </div>
                </div>
            `;

            this.setupDropAreas();
        }

        setupDropAreas() {
            const playerDropArea = this.shadowRoot!.getElementById("player-drop-area")!;
            const enemyDropArea = this.shadowRoot!.getElementById("enemy-drop-area")!;

            playerDropArea.addEventListener("dragover", (e) => this.handleDragOver(e));
            playerDropArea.addEventListener("drop", (e) => this.handleDrop(e, "player"));

            enemyDropArea.addEventListener("dragover", (e) => this.handleDragOver(e));
            enemyDropArea.addEventListener("drop", (e) => this.handleDrop(e, "enemy"));
        }

        handleDragOver(event: DragEvent) {
            event.preventDefault();
        }

        handleDrop(event: DragEvent, side: "player" | "enemy") {
            event.preventDefault();
            const data = event.dataTransfer!.getData("text/plain");
            const card = document.getElementById(data);
            if (card) {
                const dropArea =
                    side === "player"
                        ? this.shadowRoot!.getElementById("player-drop-area")!
                        : this.shadowRoot!.getElementById("enemy-drop-area")!;
                if (dropArea.children.length < 4) {
                    dropArea.appendChild(card);
                    this.updatePoints(side, parseInt(card.getAttribute("power")!));
                }
            }
        }

        updatePoints(side: "player" | "enemy", points: number) {
            if (side === "player") {
                this.playerPoints += points;
                this.shadowRoot!.getElementById("player-points")!.textContent = this.playerPoints.toString();
            } else {
                this.enemyPoints += points;
                this.shadowRoot!.getElementById("enemy-points")!.textContent = this.enemyPoints.toString();
            }
        }
    },
);
