import {GameContainer} from "./elements/game-container.js";

const STORAGE_KEY = "RUNv0";

export function save_game_state(game: GameContainer) {
    let state = game.GetState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    console.log("%cGame state saved", "color: red");
}

export function has_game_state() {
    return localStorage.getItem(STORAGE_KEY) !== null;
}

export function get_game_state() {
    let state = localStorage.getItem(STORAGE_KEY);
    if (state) {
        return JSON.parse(state);
    }
}

export function load_game_state(game: GameContainer) {
    let state = get_game_state();
    if (state) {
        game.CurrentOpponent = state.CurrentOpponent;
        game.PlayerDeck = state.PlayerDeck;
        console.log("%cGame state loaded", "color: red");
    }
}
