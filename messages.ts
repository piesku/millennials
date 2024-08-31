import {CardController} from "./cards/CardController.js";
import {LocationController} from "./locations/LocationController.js";

// TODO Use const enum.
export enum Message {
    BattleStarts = 1,
    BattleEnds,
    TurnStarts,
    TurnEnds,
    LocationReveals,
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
    fork(indent?: 1) {
        let trace = this.slice() as Trace;
        if (indent) {
            trace.push(indent);
        }
        return trace;
    }

    log(msg: string): [Trace, string] {
        return [this, msg];
    }
}
