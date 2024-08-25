import {html} from "../lib/html.js";
import {Sprites} from "../sprites/sprites.js";
import {BattleScene} from "./battle-scene.js";

export class GameContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    Render() {
        let view = this.getAttribute("view");
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                }
                main {
                    display: none;
                }
                main[name="${view}"] {
                    display: block;
                }
            </style>
            <main name="title">
                <flex-col style="height:100vh; justify-content:center; align-items:center;">
                    <h1><i>The Dirty Dozen</i></h1>
                    <button id="run">Start a New Run</button>
                    <button id="collection">Collection</button>
                </flex-col>
            </main>

            <main name="run">
                <slot></slot>
            </main>

            <main name="collection">
                <collection-viewer></collection-viewer>
            </main>
        `;
    }

    static observedAttributes = ["view"];
    attributeChangedCallback() {
        this.Render();

        switch (this.getAttribute("view")) {
            case "run":
                let battle = this.querySelectorAll<BattleScene>("battle-scene")[this.CurrentOpponent];
                battle.PrepareBattle();
                break;
        }
    }

    connectedCallback() {
        this.shadowRoot!.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            switch (target.id) {
                case "title":
                    history.pushState("title", "", "");
                    this.setAttribute("view", "title");
                    break;
                case "run":
                    history.pushState("run", "", "#run");
                    this.setAttribute("view", "run");
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

        this.Render();
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

    CurrentOpponent = 0;

    ProgressToNextOpponent() {
        this.CurrentOpponent++;
        if (this.CurrentOpponent >= this.querySelectorAll<BattleScene>("battle-scene").length) {
            alert("You win the run!");
        }

        history.pushState(
            {
                CurrentOpponent: this.CurrentOpponent,
                PlayerDeck: this.PlayerDeck,
            },
            "",
        );

        let battle = this.querySelectorAll<BattleScene>("battle-scene")[this.CurrentOpponent];
        battle.PrepareBattle();

        window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: "smooth",
        });
    }
}

customElements.define("game-container", GameContainer);
