import {GameContainer} from "./elements/game-container.js";

const STORAGE_KEY = "RUNv1";

export function save_game_state(game: GameContainer) {
    let state = {
        curr: game.CurrentOpponent,
        deck: game.PlayerDeck,
    };
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
        game.CurrentOpponent = state.curr;
        game.PlayerDeck = state.deck;
        console.log("%cGame state loaded", "color: red");
    }
}
