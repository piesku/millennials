import {html} from "../lib/html.js";
import {Sprites} from "../sprites/sprites.js";
import {BattleScene} from "./battle-scene.js";

export class GameContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.PushState();
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
                    this.PushState();
                    break;
                case "run":
                    this.CurrentView = "run";
                    this.ProgressToNextOpponent();
                    break;
                case "collection":
                    this.CurrentView = "collection";
                    this.PushState();
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

        switch (this.CurrentView) {
            case "run":
                this.InitBattle();
                break;
        }

        this.ReRender();
    }

    PlayerDeck = history.state?.PlayerDeck ?? [
        Sprites.Raphael,
        Sprites.Raphael,
        Sprites.Raphael,
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

    CurrentOpponent = history.state?.CurrentOpponent ?? -1;
    CurrentView = history.state?.CurrentView ?? "title";

    InitBattle() {
        let battle = this.querySelector<BattleScene>(`battle-scene[name="${this.CurrentOpponent}"]`);
        if (battle) {
            battle.PrepareBattle();
        } else if (DEBUG) {
            throw `<battle-scene name="${this.CurrentOpponent}"> not found`;
        }
    }

    ProgressToNextOpponent() {
        let previous_battle = this.querySelector<BattleScene>(`battle-scene[name="${this.CurrentOpponent}"]`);
        if (previous_battle) {
            previous_battle.remove();
        }

        this.CurrentOpponent++;

        let next_battle = this.querySelector<BattleScene>(`battle-scene[name="${this.CurrentOpponent}"]`);
        if (!next_battle) {
            alert("You win the run!");
        }

        this.PushState();
        this.ReRender();

        this.InitBattle();
    }

    PushState() {
        let state = {
            CurrentView: this.CurrentView,
            CurrentOpponent: this.CurrentOpponent,
            PlayerDeck: this.PlayerDeck,
        };

        history.pushState(state, this.CurrentView.toUpperCase(), "#" + this.CurrentView);
    }
}

customElements.define("game-container", GameContainer);
