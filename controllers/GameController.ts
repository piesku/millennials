import {html} from "../lib/html.js";

export class GameController extends HTMLElement {
    static observedAttributes = ["view"];
    attributeChangedCallback() {
        switch (this.getAttribute("view")) {
            case "title":
                this.innerHTML = html`
                    <flex-col style="height:100vh; justify-content:center; align-items:center;">
                        <h1><i>The Dirty Dozen</i></h1>
                        <button id="battle">Start Game</button>
                        <button id="collection">Collection</button>
                    </flex-col>
                `;
                break;
            case "battle":
                this.innerHTML = html`
                    <battle-controller>
                        <a-actor type="empire" id="villain">
                            <a-deck reverse></a-deck>
                            <a-hand></a-hand>
                            <a-trash></a-trash>
                        </a-actor>

                        <a-table></a-table>

                        <a-actor type="player" id="player">
                            <a-deck></a-deck>
                            <a-hand></a-hand>
                            <a-trash></a-trash>
                            <button slot="end">End Turn</button>
                        </a-actor>

                        <a-log slot="log"></a-log>
                    </battle-controller>
                `;
                break;
            case "collection":
                this.innerHTML = html` <collection-viewer></collection-viewer> `;
                break;
        }
    }

    connectedCallback() {
        this.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            switch (target.id) {
                case "title":
                    this.setAttribute("view", "title");
                    break;
                case "battle":
                    this.setAttribute("view", "battle");
                    break;
                case "collection":
                    this.setAttribute("view", "collection");
                    break;
            }
        });
    }
}

customElements.define("game-controller", GameController);
