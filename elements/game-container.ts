import {html} from "../lib/html.js";

export class GameContainer extends HTMLElement {
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
                    <battle-scene>
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
                    </battle-scene>
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
                case "battle":
                    history.pushState("battle", "", "battle");
                    this.setAttribute("view", "battle");
                    break;
                case "collection":
                    history.pushState("collection", "", "collection");
                    this.setAttribute("view", "collection");
                    break;
                default:
                    this.setAttribute("view", "title");
            }
        });

        window.addEventListener("popstate", (e) => {
            this.setAttribute("view", e.state ?? "title");
        });
    }
}

customElements.define("game-container", GameContainer);
