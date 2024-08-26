import {CardController} from "./cards/CardController.js";
import {LocationController} from "./locations/LocationController.js";

export const enum Message {
    BattleStarts = 1,
    BattleEnds,
    TurnStarts,
    TurnEnds,
    CardEntersTable,
    CardMovesFromLocation,
    CardMovesToLocation,
}

export class Trace extends Array<CardController | LocationController | 1> {
    fork() {
        return this.slice() as Trace;
    }

    log(msg: string): [Trace, string] {
        return [this, msg];
    }
}
