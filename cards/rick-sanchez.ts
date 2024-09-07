import {CardElement} from "../elements/a-card.js";
import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class RickSanchez extends CardController {
    Name = "Sick Ranchez";
    Cost = 6;
    Power = 0;
    Text = "Always: Has the combined Power of all trashed cards";
    Sprite = Sprites.RickSanchez;

    override *OnReveal(trace: Trace) {
        const trashedCards = this.Battle.querySelectorAll<CardElement>("a-trash a-card");

        let combinedPower = 0;
        for (let i = 0; i < trashedCards.length; i++) {
            combinedPower += trashedCards[i].Instance.Power;
        }
        yield trace.log(this.AddModifier(this, "addpower", combinedPower));
    }

    override *OnMessage(kind: Message, trace: Trace, card?: CardController): Generator<[Trace, string], void> {
        switch (kind) {
            case Message.CardEntersTrash:
            case Message.CardLeavesTrash:
                const trashedCards = this.Battle.querySelectorAll<CardElement>("a-trash a-card");
                let combinedPower = 0;
                for (let i = 0; i < trashedCards.length; i++) {
                    combinedPower += trashedCards[i].Instance.Power;
                }

                this.RemoveModifiers(this);

                yield trace.log(this.AddModifier(this, "addpower", combinedPower));
                break;
        }
    }
}
