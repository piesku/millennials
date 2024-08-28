import {CardController} from "./cards/CardController.js";
import {LocationController} from "./locations/LocationController.js";

// TODO Use const enum.
export enum Message {
    BattleStarts = 1,
    BattleEnds,
    TurnStarts,
    TurnEnds,
    CardEntersTable,
    CardLeavesTable,
    CardMovesFromLocation,
    CardMovesToLocation,
    CardEntersHand,
    CardLeavesHand,
    CardEntersDeck,
    CardLeavesDeck,
    CardEntersTrash,
    CardLeavesTrash,
}

export class Trace extends Array<CardController | LocationController | 1> {
    fork() {
        return this.slice() as Trace;
    }

    log(msg: string): [Trace, string] {
        return [this, msg];
    }
}
