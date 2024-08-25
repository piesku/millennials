import {html} from "../lib/html.js";
import {Sprites} from "../sprites/sprites.js";
import {BattleScene} from "./battle-scene.js";

export class GameContainer extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = html`<slot></slot>`;
    }

    static observedAttributes = [];
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
                this.shadowRoot!.innerHTML = html``;
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

        let battle = this.querySelectorAll<BattleScene>("battle-scene")[this.CurrentOpponent];
        battle.PrepareBattle();
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
