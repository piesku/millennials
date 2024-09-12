import {CardController} from "./cards/CardController.js";
import {LocationController} from "./locations/LocationController.js";

// TODO Use const enum.
export enum Message {
    // BattleStarts = 1,
    // BattleEnds,
    TurnStarts,
    TurnEnds,
    // LocationReveals,
    CardEntersTable,
    CardLeavesTable,
    CardMovesFromLocation,
    CardMovesToLocation,
    CardEntersHand,
    CardLeavesHand,
    // CardEntersDeck,
    // CardLeavesDeck,
    CardEntersTrash,
    CardLeavesTrash,
}

type Traceable = CardController | LocationController | 1 | -1;

export class Trace extends Array<Traceable> {
    fork(traceable?: Traceable) {
        let trace = this.slice() as Trace;
        if (traceable) {
            trace.push(traceable);
        }
        return trace;
    }

    log(msg: string): [Trace, string] {
        return [this, msg];
    }
}
