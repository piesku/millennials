import {DaltonBro, Joker, MojoJojo, Skeletor} from "../actors/cartoon.js";
import {Alien, Borg, Dalek, DarthVader, Stormtrooper} from "../actors/space.js";
import {Baracus} from "../cards/a-baracus.js";
import {Faceman} from "../cards/a-faceman.js";
import {Hannibal} from "../cards/a-hannibal.js";
import {Murdock} from "../cards/a-murdock.js";
import {AceVentura} from "../cards/ace-ventura.js";
import {Aladdin} from "../cards/al-addin.js";
import {Batman} from "../cards/bat-man.js";
import {Beavis} from "../cards/beavis.js";
import {BillMurray} from "../cards/bill-murray.js";
import {BluePowerRanger} from "../cards/blue-powerranger.js";
import {Butthead} from "../cards/butthead.js";
import {BuzzLightyear} from "../cards/buzz-lightyear.js";
import {CaptainPlaner} from "../cards/captain-planet.js";
import {CardController} from "../cards/CardController.js";
import {DanAykroyd} from "../cards/dan-aykroyd.js";
import {DenverDinosaur} from "../cards/denver-dinosaur.js";
import {ForrestGump} from "../cards/forrest-gump.js";
import {Frodo} from "../cards/frodo-baggins.js";
import {Gandalf} from "../cards/gan-dalf.js";
import {Genie} from "../cards/ge-nie.js";
import {Goku} from "../cards/goku.js";
import {HarryPotter} from "../cards/harry-potter.js";
import {Heman} from "../cards/he-man.js";
import {Hermione} from "../cards/hermi-one.js";
import {HomerSimpson} from "../cards/homer-simpson.js";
import {IndianaJones} from "../cards/indiana-jones.js";
import {InspectorGadget} from "../cards/inspector-gadget.js";
import {JamesBond} from "../cards/james-bond.js";
import {JohnMcClane} from "../cards/john-mcclane.js";
import {JohnRambo} from "../cards/john-rambo.js";
import {JohnyBravo} from "../cards/johny-bravo.js";
import {KevinHomeAlone} from "../cards/kevin-homealone.js";
import {Kirilin} from "../cards/kirilan.js";
import {Krecik} from "../cards/kre-cik.js";
import {KungFuPanda} from "../cards/KungFuPanda.js";
import {LaraCroft} from "../cards/lara-croft.js";
import {LuckyLuke} from "../cards/lucky-luke.js";
import {LukeSkywalker} from "../cards/luke-skywalker.js";
import {MacGyver} from "../cards/mac-gyver.js";
import {Marble} from "../cards/marble.js";
import {MartyMcFly} from "../cards/marty-mcfly.js";
import {Maximus} from "../cards/maximus.js";
import {Megaman} from "../cards/mega-man.js";
import {Neo} from "../cards/ne-o.js";
import {ObiWanKenobi} from "../cards/obi-wan-kenobi.js";
import {OptimusPrime} from "../cards/optimus-prime.js";
import {Pikachu} from "../cards/pikachu.js";
import {RedPowerRanger} from "../cards/red-powerranger.js";
import {RobinHood} from "../cards/robin-hood.js";
import {Robocop} from "../cards/robo-cop.js";
import {Ron} from "../cards/ron-wesley.js";
import {Samwise} from "../cards/sam-wise.js";
import {Superman} from "../cards/super-man.js";
import {Tarzan} from "../cards/tarzan.js";
import {TheMask} from "../cards/the-mask.js";
import {Donatello} from "../cards/tmnt-donatello.js";
import {Leonardo} from "../cards/tmnt-leonardo.js";
import {MichaelAngelo} from "../cards/tmnt-michaelangelo.js";
import {Raphael} from "../cards/tmnt-raphael.js";
import {Trinity} from "../cards/trini-ty.js";
import {Tsubasa} from "../cards/tsubasa.js";
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
        [Sprites.Kirilin]: Kirilin,
        [Sprites.Tsubasa]: Tsubasa,
        [Sprites.Woody]: Woody,
        [Sprites.Krecik]: Krecik,
        [Sprites.MacGyver]: MacGyver,
        [Sprites.Hannibal]: Hannibal,
        [Sprites.Faceman]: Faceman,
        [Sprites.Murdock]: Murdock,
        [Sprites.BABaracus]: Baracus,
        [Sprites.CaptainPlanet]: CaptainPlaner,
        [Sprites.IndianaJones]: IndianaJones,
        [Sprites.JamesBond]: JamesBond,
        [Sprites.Hermione]: Hermione,
        [Sprites.Ron]: Ron,
        [Sprites.Goku]: Goku,
        [Sprites.Homer]: HomerSimpson,
        [Sprites.Buzz]: BuzzLightyear,
        [Sprites.Denver]: DenverDinosaur,
        [Sprites.Beavis]: Beavis,
        [Sprites.Butthead]: Butthead,
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
        [Sprites.JohnyBravo]: JohnyBravo,
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

        [Sprites.Marble]: Marble,

        [Sprites.Joker]: Joker,
        [Sprites.MojoJojo]: MojoJojo,
        [Sprites.DaltonBro]: DaltonBro,
        [Sprites.Skeletor]: Skeletor,
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
                    $${this.Instance.CurrentCost}
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
                    user-select: none;
                    border-radius: 5px;
                }

                :host .body {
                    height: 180px;
                    position: relative;
                    border-radius: 5px;
                    background: ${color_from_seed(this.Instance.Sprite)};
                    cursor: pointer;
                }

                :host-context(location-owner) {
                    .body {
                        width: 60px;
                        height: 90px;

                        .header {
                            font-size: 0.4em;
                            margin: 0 3px;
                        }

                        .header span {
                            font-size: 8px;
                        }

                        .sprite-border {
                            height: ${target_height / 2}px;
                        }

                        .sprite {
                            width: ${target_height / 4}px;
                            height: ${target_height / 2}px;
                            margin: 0 ${pixel_size}px 0 ${pixel_size * 1.5}px;
                            background-position: 0 -${sprite_y / 2}px;
                            background-size: ${target_height / 4}px auto;
                        }

                        .text-container {
                            min-height: 28px;
                        }

                        .name {
                            font-size: 0.5em;
                            padding: 0 1px;
                        }

                        .description {
                            display: none;
                        }
                    }
                }

                :host(:not(.frontside)) {
                    background-image: repeating-linear-gradient(45deg, #fe7 0px, #fd6 10px, #fa8 20px);
                    box-shadow: inset 0 0 0 1px #00000066;
                }

                :host(.unplayable) .body {
                    filter: contrast(0.3) brightness(1.5);
                    cursor: not-allowed;
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

                .sprite {
                    width: ${target_height / 2}px;
                    height: ${target_height}px;
                    margin: 0 ${pixel_size * 2}px 0 ${pixel_size * 3}px;
                    background-position: 0 -${sprite_y}px;
                    background-size: ${target_height / 2}px auto;
                    background-image: ${background_url};
                    image-rendering: pixelated;
                }

                :host(.unknown) .sprite {
                    filter: brightness(0);
                }

                .mask {
                    position: absolute;
                    inset: 0;
                    border-radius: 5px;
                    background-image: ${mask_url};
                    background-size: ${target_height}px auto;
                    image-rendering: pixelated;
                }

                :host(.unknown) .mask {
                    background: none;
                }

                .header {
                    position: absolute;
                    inset: 2px 3px auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 1;
                    color: #fff;
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
                    inset: auto 0 0;
                    height: 58px;
                    padding: 1px;
                    border-radius: 0 0 5px 5px;
                    background: #00000066;
                    align-content: center;
                    text-align: center;
                    color: #fff;
                }

                .name {
                    font-size: 1em;
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

                    --x: 50%;
                    --y: 50%;
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
                    border-radius: 5px;
                    background-image: radial-gradient(circle at var(--x) var(--y), #ffffff99 0%, transparent 65%);
                }

                dialog::backdrop {
                    background: radial-gradient(#f69d3caa, #3f87a6aa);
                }

                card-detail {
                    height: 180px;
                    border-radius: 5px;
                    padding: 0;
                    position: relative;
                    background: ${color_from_seed(this.Instance.Sprite)};

                    box-shadow: 0 20px 10px -5px #00000088;
                }

                card-modifiers {
                    font-size: 30%;
                    margin: 0 10px;
                    width: 100px;
                    background: white;
                }
            </style>

            <flex-col class="body" start onclick="event.stopPropagation(); this.nextElementSibling.showModal();"
                >${card_body}</flex-col
            >

            <dialog onclick="event.stopPropagation(); this.close()">
                <div class="content">
                    <flex-col>
                        <card-detail>
                            <div class="reflection"></div>
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
