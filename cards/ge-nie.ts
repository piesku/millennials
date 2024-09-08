import {element} from "../lib/random.js";
import {Trace} from "../messages.js";
import {Sprites} from "../sprites/sprites.js";
import {CardController} from "./CardController.js";

export class Genie extends CardController {
    Name = "Djin";
    Cost = 6;
    Power = 0;
    Text = "Once: Trash one of your other cards here to copy it at the other locations.";
    Sprite = Sprites.Genie;

    override *OnReveal(trace: Trace) {
        const cardsHere = this.Location?.GetRevealedCards(this.Owner) || [];
        const filteredCardsHere = cardsHere.filter((card) => card !== this);

        if (filteredCardsHere.length === 0) {
            yield trace.log(`No other cards here to trash`);
            return;
        }

        const cardToTrash = element(cardsHere);
        yield* cardToTrash.Trash(trace);

        for (let otherLocation of this.Battle.Locations) {
            if (otherLocation !== this.Location) {
                const card = cardToTrash.Clone();

                const _trace = trace.fork();
                _trace.push(card.Instance);

                yield trace.log(`${cardToTrash.Name} has been copied to ${otherLocation.Name}`);
                yield* otherLocation.AddCard(card.Instance, _trace, this.Owner);
            }
        }
    }
}
