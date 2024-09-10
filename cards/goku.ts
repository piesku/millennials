import {CardElement} from "../elements/a-card.js";
import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Goku extends CardController {
    Name = "Carrotku";
    Cost = 6;
    Power = 0;
    Text = "Always: Has the combined Power of all trashed cards";
    Sprite = Sprites.Goku;

    override *OnMessageSelf(kind: Message, trace: Trace) {
        switch (kind) {
            case Message.CardEntersTable:
                this.RemoveModifiers(this);
                let combined_power = 0;
                let trashed_cards = this.Battle.querySelectorAll<CardElement>("a-trash a-card");
                for (let card of trashed_cards) {
                    combined_power += card.Instance.Power;
                }
                yield trace.log(this.AddModifier(this, "setpower", combined_power));
                break;
            case Message.CardLeavesTable:
                this.RemoveModifiers(this);
                break;
        }
    }

    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        switch (kind) {
            case Message.CardEntersTrash:
            case Message.CardLeavesTrash:
                this.RemoveModifiers(this);
                let combined_power = 0;
                let trashed_cards = this.Battle.querySelectorAll<CardElement>("a-trash a-card");
                for (let card of trashed_cards) {
                    combined_power += card.Instance.Power;
                }
                yield trace.log(this.AddModifier(this, "setpower", combined_power));
        }
    }
}
