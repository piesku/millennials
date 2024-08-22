import {html} from "../lib/html.js";

export class GameController extends HTMLElement {
    static observedAttributes = ["view"];
    attributeChangedCallback() {
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
    }
}

customElements.define("game-controller", GameController);
