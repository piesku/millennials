import {Message, Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class JohnRambo extends CardController {
    Name = "Ron Jambo";
    Cost = 5;
    Power = 0;
    Text = "Always: Has a power equal to the sum of your other cards here";
    Sprite = Sprites.JohnRambo;

    override *OnMessageSelf(kind: Message, trace: Trace) {
        switch (kind) {
            case Message.CardEntersTable:
                let total_power = 0;
                let cards_here = this.Location?.GetRevealedCards(this.Owner) || [];
                for (let card of cards_here) {
                    if (card !== this) {
                        total_power += card.CurrentPower;
                    }
                }

                yield trace.log(this.AddModifier(this, "setpower", total_power));

                break;
        }
    }

    override *OnMessage(kind: Message, trace: Trace, card?: CardController) {
        if (card?.Location !== this.Location) {
            return;
        }

        if (card?.Owner !== this.Owner) {
            return;
        }

        switch (kind) {
            case Message.CardEntersTable:
            case Message.CardLeavesTable:
            case Message.CardMovesToLocation:
            case Message.CardMovesFromLocation:
                let total_power = 0;
                let cards_here = this.Location!.GetRevealedCards(this.Owner);
                for (let card of cards_here) {
                    if (card !== this) {
                        total_power += card.CurrentPower;
                    }
                }
                this.RemoveModifiers(this);
                yield trace.log(this.AddModifier(this, "setpower", total_power));
                break;
        }
    }
}
