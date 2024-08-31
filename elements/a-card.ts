import {DarthVader, Stormtrooper} from "../actors/empire.js";
import {Baracus} from "../cards/a-baracus.js";
import {Faceman} from "../cards/a-faceman.js";
import {Hannibal} from "../cards/a-hannibal.js";
import {Murdock} from "../cards/a-murdock.js";
import {Batman} from "../cards/bat-man.js";
import {Blade} from "../cards/bla-de.js";
import {BuzzLightyear} from "../cards/buzz-lightyear.js";
import {CardController} from "../cards/CardController.js";
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
import {color_from_seed} from "../lib/color.js";
import {html} from "../lib/html.js";
import {Sprites} from "../sprites/sprites.js";

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

        this.Render();
    }

    connectedCallback() {
        DEBUG: if (!this.hasAttribute("type")) {
            throw new Error("CardElement: type attribute is required");
        }

        this.Render();
    }

    Render() {
        this.id = this.Instance.Id.toString();

        const target_width = 120;
        const target_height = 140;

        const card_body = html`
            <div class="header">
                <span
                    id="cost"
                    class="${
                        this.Instance.CurrentCost > this.BaseCost
                            ? "incr"
                            : this.Instance.CurrentCost < this.BaseCost
                              ? "decr"
                              : ""
                    }"
                >
                    ${this.Instance.CurrentCost}
                </span>
                <span
                    id="power"
                    class="${
                        this.Instance.CurrentPower > this.BasePower
                            ? "incr"
                            : this.Instance.CurrentPower < this.BasePower
                              ? "decr"
                              : ""
                    }"
                >
                    ${this.Instance.CurrentPower}
                </span>
            </div>
            <div class="sprite-border">
                <div class="sprite"></div>
                </div>
                <div class="text-container">
                    <div class="name">${this.Instance.Name}</div>
                    <div class="description">${this.Instance.Text}</div>
                </div>
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
                    background: white;
                    border-radius: 5px;
                }

                :host(.dragging) {
                    opacity: 0.3;
                }

                .sprite {
                    width: ${target_width}px;
                    height: ${target_height}px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 100px;
                    font-family: "Comic Sans MS", "Comic Sans", cursive;
                    text-shadow: 2px 2px 2px white;
                    transform: translate(-5px, -15px);
                    letter-spacing: -5px;
                }

                .sprite-border {
                    height: ${target_height}px;
                    background-color: ${color_from_seed(this.Instance.Name)};
                    overflow: hidden;
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
                    z-index: 1;
                }

                #cost.decr,
                #power.incr {
                    color: green;
                    scale: 5;
                    z-index: 1;
                }

                .text-container {
                    box-sizing: border-box;
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    min-height: 40px;
                    padding: 1px;
                    align-content: center;
                    background-color: white;
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
                    font-size: 0.7em;
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
                    perspective: 800px;
                }

                dialog .content {
                    position: relative;
                    transform: rotateX(var(--x-rotation)) rotateY(var(--y-rotation));
                    transition: transform 0.1s;
                }

                dialog .content:hover {
                    transform: rotateX(var(--x-rotation)) rotateY(var(--y-rotation)) scale(1.2);
                }

                dialog .reflection {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    background-image: radial-gradient(circle at var(--x) var(--y), #ffffff99 0%, transparent 65%);
                }

                dialog::backdrop {
                    background: radial-gradient(#f69d3caa, #3f87a6aa);
                }

                card-detail {
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

            <flex-col start onclick="event.stopPropagation(); this.nextElementSibling.showModal();"
                >${card_body}</flex-col
            >

            <dialog onclick="event.stopPropagation(); this.close()">
                <div class="content">
                    <div class="reflection"></div>
                    <flex-col>
                        <card-detail>
                            <flex-col start>${card_body}</flex-col>
                        </card-detail>
                        <card-modifiers>
                            <slot></slot>
                        </card-modifiers>
                    </flex-col>
                </div>
            </dialog>
        `;

        let dialog = this.shadowRoot!.querySelector("dialog")!;
        let bbox = dialog.getBoundingClientRect();

        dialog.addEventListener("mouseenter", (ev) => {
            bbox = dialog.getBoundingClientRect();
        });

        dialog.addEventListener("mousemove", (ev) => {
            let x = ev.clientX - bbox.left;
            let y = ev.clientY - bbox.top;
            let x_percent = x / bbox.width;
            let y_percent = y / bbox.height;
            let x_rotation = (x_percent - 0.5) * 20;
            let y_rotation = (0.5 - y_percent) * 20;

            dialog.style.setProperty("--x-rotation", `${y_rotation}deg`);
            dialog.style.setProperty("--y-rotation", `${x_rotation}deg`);
            dialog.style.setProperty("--x", `${x_percent * 100}%`);
            dialog.style.setProperty("--y", `${y_percent * 100}%`);
        });
    }

    static Compare(a: CardElement, b: CardElement) {
        if (a.Instance.Cost !== b.Instance.Cost) {
            return a.Instance.Cost - b.Instance.Cost;
        } else {
            return a.Instance.Name.localeCompare(b.Instance.Name);
        }
    }
}

customElements.define("a-card", CardElement);
