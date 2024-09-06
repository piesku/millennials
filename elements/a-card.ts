import {Alien, Borg, Dalek, DarthVader, Stormtrooper} from "../actors/empire.js";
import {Baracus} from "../cards/a-baracus.js";
import {Faceman} from "../cards/a-faceman.js";
import {Hannibal} from "../cards/a-hannibal.js";
import {Murdock} from "../cards/a-murdock.js";
import {AceVentura} from "../cards/ace-ventura.js";
import {Aladdin} from "../cards/al-addin.js";
import {Batman} from "../cards/bat-man.js";
import {BillMurray} from "../cards/bill-murray.js";
import {Blade} from "../cards/bla-de.js";
import {BluePowerRanger} from "../cards/blue-powerranger.js";
import {BuzzLightyear} from "../cards/buzz-lightyear.js";
import {CardController} from "../cards/CardController.js";
import {DanAykroyd} from "../cards/dan-aykroyd.js";
import {DenverDinosaur} from "../cards/denver-dinosaur.js";
import {ForrestGump} from "../cards/forrest-gump.js";
import {Frodo} from "../cards/frodo-baggins.js";
import {Gandalf} from "../cards/gan-dalf.js";
import {Genie} from "../cards/ge-nie.js";
import {HarryPotter} from "../cards/harry-potter.js";
import {Heman} from "../cards/he-man.js";
import {Hermione} from "../cards/hermi-one.js";
import {HomerSimpson} from "../cards/homer-simpson.js";
import {IndianaJones} from "../cards/indiana-jones.js";
import {InspectorGadget} from "../cards/inspector-gadget.js";
import {JackSparrow} from "../cards/JackSparrow.js";
import {JamesBond} from "../cards/james-bond.js";
import {JohnMcClane} from "../cards/john-mcclane.js";
import {JohnRambo} from "../cards/john-rambo.js";
import {KevinHomeAlone} from "../cards/kevin-homealone.js";
import {Krecik} from "../cards/kre-cik.js";
import {KungFuPanda} from "../cards/KungFuPanda.js";
import {LaraCroft} from "../cards/lara-croft.js";
import {LuckyLuke} from "../cards/lucky-luke.js";
import {LukeSkywalker} from "../cards/luke-skywalker.js";
import {MacGyver} from "../cards/mac-gyver.js";
import {MartyMcFly} from "../cards/marty-mcfly.js";
import {Maximus} from "../cards/maximus.js";
import {Megaman} from "../cards/mega-man.js";
import {Morty} from "../cards/mor-ty.js";
import {Mufasa} from "../cards/mufa-sa.js";
import {Neo} from "../cards/ne-o.js";
import {ObiWanKenobi} from "../cards/obi-wan-kenobi.js";
import {OptimusPrime} from "../cards/optimus-prime.js";
import {Pikachu} from "../cards/pikachu.js";
import {RedPowerRanger} from "../cards/red-powerranger.js";
import {RickSanchez} from "../cards/rick-sanchez.js";
import {RobinHood} from "../cards/robin-hood.js";
import {Robocop} from "../cards/robo-cop.js";
import {Ron} from "../cards/ron-wesley.js";
import {Samwise} from "../cards/sam-wise.js";
import {SheRa} from "../cards/she-ra.js";
import {Simba} from "../cards/sim-ba.js";
import {Superman} from "../cards/super-man.js";
import {Tarzan} from "../cards/tarzan.js";
import {TheMask} from "../cards/the-mask.js";
import {Donatello} from "../cards/tmnt-donatello.js";
import {Leonardo} from "../cards/tmnt-leonardo.js";
import {MichaelAngelo} from "../cards/tmnt-michaelangelo.js";
import {Raphael} from "../cards/tmnt-raphael.js";
import {Trinity} from "../cards/trini-ty.js";
import {Woody} from "../cards/woo-dy.js";
import {color_from_seed} from "../lib/color.js";
import {html} from "../lib/html.js";
import {integer} from "../lib/random.js";
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
        [Sprites.BillMurray]: BillMurray,
        [Sprites.DanAykroyd]: DanAykroyd,
        [Sprites.LuckyLuke]: LuckyLuke,
        [Sprites.AceVentura]: AceVentura,
        [Sprites.KevinHomeAlone]: KevinHomeAlone,
        [Sprites.Aladdin]: Aladdin,
        [Sprites.Genie]: Genie,
        [Sprites.Trinity]: Trinity,
        [Sprites.HeMan]: Heman,
        [Sprites.SheRa]: SheRa,
        [Sprites.OptimusPrime]: OptimusPrime,
        [Sprites.Megaman]: Megaman,
        [Sprites.Pikachu]: Pikachu,
        [Sprites.Frodo]: Frodo,
        [Sprites.Samwise]: Samwise,
        [Sprites.Gandalf]: Gandalf,
        [Sprites.JohnMcClane]: JohnMcClane,
        [Sprites.LaraCroft]: LaraCroft,
        [Sprites.TheMask]: TheMask,
        [Sprites.InspectorGadget]: InspectorGadget,
        [Sprites.Maximus]: Maximus,
        [Sprites.JohnRambo]: JohnRambo,
        [Sprites.Tarzan]: Tarzan,
        [Sprites.RedPowerRanger]: RedPowerRanger,
        [Sprites.BluePowerRanger]: BluePowerRanger,

        [Sprites.Dalek]: Dalek,
        [Sprites.Alien]: Alien,
        [Sprites.Borg]: Borg,
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
        this.id = `_${this.Instance.Id}`;

        const target_height = 120;
        const sprite_height = 10;
        const pixel_size = target_height / sprite_height;
        const sprite_y = (sprite_height + 1) * this.Instance.Sprite * pixel_size;

        const spritesheet_src = document.querySelector("img#sheet")?.getAttribute("src");
        const background_url = `url(${spritesheet_src})`;

        const mask_src = document.querySelector("img#mask")?.getAttribute("src");
        const mask_url = `url(${mask_src})`;

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
            <div class="sprite-border">
                <div class="sprite"></div>
                <div class="mask"></div>
            </div>
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

                :host(.unplayable) {
                    filter: contrast(0.3) brightness(1.5);
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

                :host(.unknown.unowned) {
                    filter: blur(5px) opacity(0.2) grayscale(1);
                }

                :host(.unowned) {
                    filter: opacity(0.2) grayscale(1);
                }

                :host(.unknown.unowned) dialog {
                    filter: blur(5px) grayscale(1);
                }

                :host(.unowned) dialog {
                    filter: grayscale(1);
                }

                .sprite-border {
                    position: relative;
                    height: ${target_height}px;
                    background: ${color_from_seed(this.Instance.Name)};
                    overflow: hidden;
                }

                .sprite {
                    width: ${target_height / 2}px;
                    height: ${target_height}px;
                    margin: 0 ${pixel_size * 2}px 0 ${pixel_size * 3}px;
                    background-image: ${background_url};
                    background-position: 0 -${sprite_y}px;
                    background-size: ${target_height / 2}px auto;
                    image-rendering: pixelated;
                }

                :host(.unknown) .sprite {
                    filter: brightness(0);
                }

                .mask {
                    position: absolute;
                    inset: 0;
                    background-image: ${mask_url};
                    background-size: ${target_height}px auto;
                    image-rendering: pixelated;
                }

                :host(.unknown) .mask {
                    background: none;
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

const colors = [
    "#000000",
    "#1D2B53",
    "#7E2553",
    "#008751",
    "#AB5236",
    "#5F574F",
    "#C2C3C7",
    "#FFF1E8",
    "#FF004D",
    "#FFA300",
    "#FFEC27",
    "#00E436",
    "#29ADFF",
    "#83769C",
    "#FF77A8",
    "#FFCCAA",
];

function gradient(spec: number[]) {
    spec = spec.map((c, i) => integer(0, 15));
    spec = spec.map((c, i) => (Math.sin(i / 5) + Math.random() > 1 ? spec[i - 1] : c));
    return `linear-gradient(to bottom, ${spec.map((c, i) => colors[c])})`;
    return `linear-gradient(to bottom, ${spec.map((c, i) => `${colors[c]} ${i * 10}%, ${colors[c]} ${i * 10 + 10}%`)})`;
}

customElements.define("a-card", CardElement);
