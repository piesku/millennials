import {Baracus} from "../cards/a-baracus.js";
import {Faceman} from "../cards/a-faceman.js";
import {Hannibal} from "../cards/a-hannibal.js";
import {Murdock} from "../cards/a-murdock.js";
import {Batman} from "../cards/bat-man.js";
import {Blade} from "../cards/bla-de.js";
import {BuzzLightyear} from "../cards/buzz-lightyear.js";
import {DenverDinosaur} from "../cards/denver-dinosaur.js";
import {ForrestGump} from "../cards/forrest-gump.js";
import {HarryPotter} from "../cards/harry-potter.js";
import {Hermione} from "../cards/hermi-one.js";
import {HomerSimpson} from "../cards/homer-simpson.js";
import {IndianaJones} from "../cards/indiana-jones.js";
import {JackSparrow} from "../cards/JackSparrow.js";
import {JamesBond} from "../cards/james-bond.js";
import {Krecik} from "../cards/kre-cik.js";
import {KungFuPanda} from "../cards/KungFuPanda.js";
import {LukeSkywalker} from "../cards/luke-skywalker.js";
import {MacGyver} from "../cards/mac-gyver.js";
import {MartyMcFly} from "../cards/marty-mcfly.js";
import {Morty} from "../cards/mor-ty.js";
import {Mufasa} from "../cards/mufa-sa.js";
import {Neo} from "../cards/ne-o.js";
import {ObiWanKenobi} from "../cards/obi-wan-kenobi.js";
import {RickSanchez} from "../cards/rick-sanchez.js";
import {RobinHood} from "../cards/robin-hood.js";
import {Robocop} from "../cards/robo-cop.js";
import {Ron} from "../cards/ron-wesley.js";
import {Simba} from "../cards/sim-ba.js";
import {Superman} from "../cards/super-man.js";
import {Donatello} from "../cards/tmnt-donatello.js";
import {Leonardo} from "../cards/tmnt-leonardo.js";
import {MichaelAngelo} from "../cards/tmnt-michaelangelo.js";
import {Raphael} from "../cards/tmnt-raphael.js";
import {Woody} from "../cards/woo-dy.js";
import {CardController} from "../controllers/CardController.js";
import {html} from "../lib/html.js";
import {Sprites} from "../sprites/sprites.js";
import {DarthVader, Stormtrooper} from "../villains/empire.js";

export class CardElement extends HTMLElement {
    Instance!: CardController;

    static Controllers: Record<Sprites, new (el: CardElement) => CardController> = {
        [Sprites.RobinHood]: RobinHood,
        [Sprites.MartyMcFly]: MartyMcFly,
        [Sprites.ForrestGump]: ForrestGump,
        [Sprites.LukeSkywalker]: LukeSkywalker,
        [Sprites.Robocop]: Robocop,
        [Sprites.ObiWanKenobi]: ObiWanKenobi,
        [Sprites.Neo]: Neo,
        [Sprites.HarryPotter]: HarryPotter,
        [Sprites.Batman]: Batman,
        [Sprites.Superman]: Superman,
        [Sprites.Leonardo]: Leonardo,
        [Sprites.Donatello]: Donatello,
        [Sprites.Raphael]: Raphael,
        [Sprites.MichaelAngelo]: MichaelAngelo,
        [Sprites.DarthVader]: DarthVader,
        [Sprites.Stormtrooper]: Stormtrooper,
        [Sprites.Morty]: Morty,
        [Sprites.Simba]: Simba,
        [Sprites.Woody]: Woody,
        [Sprites.Krecik]: Krecik,
        [Sprites.MacGyver]: MacGyver,
        [Sprites.Hannibal]: Hannibal,
        [Sprites.Faceman]: Faceman,
        [Sprites.Murdock]: Murdock,
        [Sprites.BABaracus]: Baracus,
        [Sprites.Mufasa]: Mufasa,
        [Sprites.IndianaJones]: IndianaJones,
        [Sprites.JamesBond]: JamesBond,
        [Sprites.Hermione]: Hermione,
        [Sprites.Ron]: Ron,
        [Sprites.RickSanchez]: RickSanchez,
        [Sprites.Homer]: HomerSimpson,
        [Sprites.Buzz]: BuzzLightyear,
        [Sprites.Denver]: DenverDinosaur,
        [Sprites.Blade]: Blade,
        [Sprites.JackSparrow]: JackSparrow,
        [Sprites.KungFuPanda]: KungFuPanda,
    };

    BaseCost = NaN;
    BasePower = NaN;

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    static observedAttributes = ["type"];
    attributeChangedCallback(name: string, old_value: string, new_value: string) {
        this.Instance = new CardElement.Controllers[parseInt(new_value) as Sprites](this);
        this.BaseCost = this.Instance.Cost;
        this.BasePower = this.Instance.Power;
    }

    connectedCallback() {
        if (DEBUG && !this.hasAttribute("type")) {
            throw new Error("CardElement: type attribute is required");
        }

        this.ReRender();

        this.addEventListener("dragstart", (e) => {
            const energy_left = this.Instance.Owner.CurrentEnergy;
            const card_cost = this.Instance.CurrentCost;
            if (card_cost > energy_left) {
                e.preventDefault();
                return false;
            }

            let target = e.target as HTMLElement;
            if (e.dataTransfer) {
                e.dataTransfer.setData("text/plain", target.id);
                target.classList.add("dragging");
            }
        });

        this.addEventListener("dragend", (e) => {
            let target = e.target as HTMLElement;
            target.classList.remove("dragging");
        });
    }

    ReRender() {
        const spriteSize = 16;
        const spriteMargin = 1;
        const targetSize = 120;
        const scale = targetSize / spriteSize;

        const spriteYPosition = (spriteSize + spriteMargin) * this.Instance.Sprite * scale;

        const img_src = document.querySelector("body > img[hidden]")?.getAttribute("src");
        const backgroundImageUrl = `url(${img_src})`;
        const card_body = html`
            <div class="header">
                <span
                    id="cost"
                    class="${this.Instance.CurrentCost > this.BaseCost
                        ? "incr"
                        : this.Instance.CurrentCost < this.BaseCost
                          ? "decr"
                          : ""}"
                >
                    ${this.Instance.CurrentCost}
                </span>
                <span
                    id="power"
                    class="${this.Instance.CurrentPower > this.BasePower
                        ? "incr"
                        : this.Instance.CurrentPower < this.BasePower
                          ? "decr"
                          : ""}"
                >
                    ${this.Instance.CurrentPower}
                </span>
            </div>
            <div class="sprite"></div>
            <div class="text-container">
                <div class="name">${this.Instance.Name}</div>
                <div class="description">${this.Instance.Text}</div>
            </div>
        `;

        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                    width: 120px;
                    height: 180px;
                    background-color: white;
                    border: 1px solid black;
                    border-radius: 5px;
                    cursor: move;
                    user-select: none;
                    position: relative;
                }

                :host(:not(.frontside)) {
                    background: #f6d365;
                    background-image: repeating-linear-gradient(
                        45deg,
                        rgba(255, 255, 255, 0.2) 0px,
                        #f6d365 10px,
                        #fda085 20px
                    );
                }

                :host-context(#villain) > *,
                :host > * {
                    visibility: hidden;
                }

                :host-context(a-hand) > *,
                :host(.frontside) > * {
                    visibility: visible;
                }

                :host(.dragging) {
                    opacity: 0.5;
                }

                .sprite {
                    width: ${targetSize}px;
                    height: ${targetSize}px;
                    background-image: ${backgroundImageUrl};
                    background-position: 0 -${spriteYPosition}px;
                    background-size: ${targetSize}px auto;
                    image-rendering: pixelated;
                    margin: 0 auto;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.8em;
                    font-family: Arial, sans-serif;
                    margin: 0 3px;
                }

                .header span {
                    font-weight: bold;
                    font-size: 16px;
                }

                #cost.incr,
                #power.decr {
                    color: red;
                    scale: 5;
                }

                #cost.decr,
                #power.incr {
                    color: green;
                    scale: 5;
                }

                .text-container {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    background-color: rgba(255, 255, 255, 0.7);
                    border-radius: 5px;
                    text-align: center;
                    font-family: Arial, sans-serif;
                }

                .name {
                    font-size: 1em;
                    white-space: normal;
                    word-wrap: break-word;
                    padding: 0 2px;
                    font-weight: bold;
                }

                .description {
                    font-size: 0.8em;
                }

                dialog,
                dialog:active {
                    background: transparent !important;
                    outline: none;
                    border: none;
                    width: 120px;
                    min-height: 180px;
                    scale: 3;
                    overflow: visible;
                }

                dialog::backdrop {
                    background: radial-gradient(#f69d3caa, #3f87a6aa);
                }

                card-detail {
                    width: 120px;
                    height: 180px;
                    background: white;
                    border: 1px solid black;
                    padding: 0;
                    user-select: none;
                    position: relative;
                }

                card-modifiers {
                    font-size: 30%;
                    margin: 0 10px;
                    width: 100px;
                    background: white;
                }
            </style>

            <flex-col onclick="event.stopPropagation(); this.nextElementSibling.showModal();">${card_body}</flex-col>

            <dialog onclick="event.stopPropagation(); this.close()">
                <flex-col>
                    <card-detail>
                        <flex-col>${card_body}</flex-col>
                    </card-detail>
                    <card-modifiers>
                        <slot></slot>
                    </card-modifiers>
                </flex-col>
            </dialog>
        `;

        this.id = this.Instance.Id.toString();

        if (this.closest("battle-scene")) {
            this.draggable = this.Instance.Owner.Type !== "villain";
        }
    }
}

customElements.define("a-card", CardElement);
