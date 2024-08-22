import {html} from "../lib/html.js";

export class GameController extends HTMLElement {
    static observedAttributes = ["view"];
    attributeChangedCallback() {
        switch (this.getAttribute("view")) {
            case "title":
                this.innerHTML = html`
                    <flex-col style="height:100vh; justify-content:center; align-items:center;">
                        <h1><i>The Dirty Dozen</i></h1>
                        <button id="start">Start Game</button>
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
        }
    }

    connectedCallback() {
        this.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            if (target.id === "start") {
                this.setAttribute("view", "battle");
            }
        });
    }
}

customElements.define("game-controller", GameController);
