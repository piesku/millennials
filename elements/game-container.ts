import {html} from "../lib/html.js";
import {Sprites} from "../sprites/sprites.js";
import {BattleScene} from "./battle-scene.js";

export class GameContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});

        history.pushState(this.GetState(), "", "");
    }

    ReRender() {
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                }
            </style>
            <multi-view current="${this.CurrentView}">
                <main name="title">
                    <flex-col name="title" style="height:100vh; justify-content:center; align-items:center;">
                        <h1><i>The Dirty Dozen</i></h1>
                        <button id="run">Start a New Run</button>
                        <button id="collection">Collection</button>
                    </flex-col>
                </main>
                <main name="run">
                    <multi-view current="${this.CurrentOpponent}">
                        <slot></slot>
                    </multi-view>
                </main>
                <collection-viewer name="collection"></collection-viewer>
            </multi-view>
        `;
    }

    connectedCallback() {
        this.shadowRoot!.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            switch (target.id) {
                case "title":
                    this.CurrentView = "title";
                    history.pushState(this.GetState(), "", "");
                    break;
                case "run":
                    this.CurrentView = "run";
                    this.ProgressToNextOpponent();
                    break;
                case "collection":
                    this.CurrentView = "collection";
                    history.pushState(this.GetState(), "", "#collection");
                    break;
            }

            this.ReRender();
        });

        window.addEventListener("popstate", (e) => {
            if (e.state) {
                Object.assign(this, e.state);
                this.ReRender();
            }
        });

        this.addEventListener("dragstart", (e) => {
            let card = e.target as HTMLElement;
            card.classList.add("dragging");
        });

        this.addEventListener("dragend", (e) => {
            let card = e.target as HTMLElement;
            card.classList.remove("dragging");
        });

        this.ReRender();
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

    CurrentOpponent = -1;
    CurrentView = history.state?.CurrentView ?? "title";

    ProgressToNextOpponent() {
        this.CurrentOpponent++;
        if (this.CurrentOpponent >= this.querySelectorAll<BattleScene>("battle-scene").length) {
            alert("You win the run!");
        }

        history.pushState(this.GetState(), "", "#run");
        this.ReRender();

        let battle = this.querySelectorAll<BattleScene>("battle-scene")[this.CurrentOpponent];
        battle.PrepareBattle();
    }

    GetState() {
        return {
            CurrentView: this.CurrentView,
            CurrentOpponent: this.CurrentOpponent,
            PlayerDeck: this.PlayerDeck,
        };
    }
}

customElements.define("game-container", GameContainer);
