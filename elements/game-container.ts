import {html} from "../lib/html.js";
import {Sprites} from "../sprites/sprites.js";

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
                        <a-actor type="empire" id="villain" slot="villain">
                            <a-deck reverse></a-deck>
                            <a-hand></a-hand>
                            <a-trash></a-trash>
                        </a-actor>

                        <a-table slot="table"></a-table>

                        <a-actor type="player" id="player" slot="player">
                            <a-deck></a-deck>
                            <a-hand></a-hand>
                            <a-trash></a-trash>
                        </a-actor>

                        <a-log slot="log"></a-log>
                    </battle-scene>
                `;
                break;
            case "prepare":
                this.innerHTML = html`
                    <battle-prepare>
                        <div slot="shop"></div>
                        <div slot="deck"></div>
                    </battle-prepare>
                `;
                break;
            case "collection":
                this.innerHTML = html` <collection-viewer></collection-viewer> `;
                break;
        }
    }

    connectedCallback() {
        this.setAttribute("view", history.state);

        this.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            switch (target.id) {
                case "title":
                    history.pushState("title", "", "");
                    this.setAttribute("view", "title");
                    break;
                case "battle":
                    history.pushState("battle", "", "#battle");
                    this.setAttribute("view", "battle");
                    break;
                case "collection":
                    history.pushState("collection", "", "#collection");
                    this.setAttribute("view", "collection");
                    break;
            }
        });

        window.addEventListener("popstate", (e) => {
            this.setAttribute("view", e.state ?? "title");
        });

        this.addEventListener("dragstart", (e) => {
            let card = e.target as HTMLElement;
            card.classList.add("dragging");
        });

        this.addEventListener("dragend", (e) => {
            let card = e.target as HTMLElement;
            card.classList.remove("dragging");
        });
    }

    PlayerDeck = [
        Sprites.BABaracus,
        Sprites.BABaracus,
        Sprites.BABaracus,
        Sprites.Faceman,
        Sprites.Faceman,
        Sprites.Faceman,
        Sprites.Hannibal,
        Sprites.Hannibal,
        Sprites.Hannibal,
        Sprites.Murdock,
        Sprites.Murdock,
        Sprites.Murdock,
    ];
    OrderedOpponents = [
        {
            Name: "Varth Dader",
            Sprite: Sprites.DarthVader,
            Locations: ["death-star", "arkham-asylum", "future-hill-valley"],
        },
    ];
    CurrentOpponent = 0;

    ProgressToNextOpponent() {
        this.CurrentOpponent++;
        if (this.CurrentOpponent >= this.OrderedOpponents.length) {
            alert("You win!");
        }

        history.pushState("prepare", "", "#prepare");
        this.setAttribute("view", "prepare");
    }
}

customElements.define("game-container", GameContainer);
