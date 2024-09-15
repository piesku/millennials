import {DaltonBro, Joker, MojoJojo, Skeletor} from "../actors/cartoon.js";
import {Goblin, Orc, Sauron} from "../actors/fantasy.js";
import {Alien, Borg, DarthVader, Stormtrooper} from "../actors/space.js";
import {Baracus} from "../cards/a-baracus.js";
import {Faceman} from "../cards/a-faceman.js";
import {Hannibal} from "../cards/a-hannibal.js";
import {Murdock} from "../cards/a-murdock.js";
import {AceVentura} from "../cards/ace-ventura.js";
import {Aladdin} from "../cards/al-addin.js";
import {Asterix} from "../cards/asterix.js";
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
import {JamesBond} from "../cards/james-bond.js";
import {JohnMcClane} from "../cards/john-mcclane.js";
import {JohnRambo} from "../cards/john-rambo.js";
import {JohnyBravo, Placki} from "../cards/johny-bravo.js";
import {KevinHomeAlone} from "../cards/kevin-homealone.js";
import {Kirilin} from "../cards/kirilan.js";
import {Krecik} from "../cards/kre-cik.js";
import {LaraCroft} from "../cards/lara-croft.js";
import {LuckyLuke} from "../cards/lucky-luke.js";
import {LukeSkywalker} from "../cards/luke-skywalker.js";
import {MacGyver} from "../cards/mac-gyver.js";
import {Marble} from "../cards/marble.js";
import {MartyMcFly} from "../cards/marty-mcfly.js";
import {Megaman} from "../cards/mega-man.js";
import {Neo} from "../cards/ne-o.js";
import {Obelix} from "../cards/obelix.js";
import {ObiWanKenobi} from "../cards/obi-wan-kenobi.js";
import {OptimusPrime} from "../cards/optimus-prime.js";
import {Pikachu} from "../cards/pikachu.js";
import {PowerpuffBubbles} from "../cards/powerpuff-bubbles.js";
import {RedPowerRanger} from "../cards/red-powerranger.js";
import {Rhino} from "../cards/rhino.js";
import {RobinHood} from "../cards/robin-hood.js";
import {Robocop} from "../cards/robo-cop.js";
import {Ron} from "../cards/ron-wesley.js";
import {Superman} from "../cards/super-man.js";
import {Tarzan} from "../cards/tarzan.js";
import {TetrisBlock} from "../cards/tetris-block.js";
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
    Controller!: CardController;

    static Controllers: Array<new (el: CardElement) => CardController> = [
        RobinHood,
        MartyMcFly,
        ForrestGump,
        LukeSkywalker,
        Robocop,
        ObiWanKenobi,
        Neo,
        HarryPotter,
        Batman,
        Superman,
        Leonardo,
        Donatello,
        Raphael,
        MichaelAngelo,
        DarthVader,
        Stormtrooper,
        Kirilin,
        Tsubasa,
        Woody,
        Krecik,
        MacGyver,
        Hannibal,
        Faceman,
        Murdock,
        Baracus,
        CaptainPlaner,
        IndianaJones,
        JamesBond,
        Hermione,
        Ron,
        Goku,
        HomerSimpson,
        BuzzLightyear,
        DenverDinosaur,
        Beavis,
        Butthead,
        Obelix,
        BillMurray,
        DanAykroyd,
        LuckyLuke,
        AceVentura,
        KevinHomeAlone,
        Aladdin,
        Genie,
        Trinity,
        Heman,
        JohnyBravo,
        OptimusPrime,
        Megaman,
        Pikachu,
        Frodo,
        TetrisBlock,
        Gandalf,
        JohnMcClane,
        LaraCroft,
        TheMask,
        Asterix,
        PowerpuffBubbles,
        JohnRambo,
        Tarzan,
        RedPowerRanger,
        BluePowerRanger,
        Alien,
        Borg,
        Marble,
        Joker,
        MojoJojo,
        DaltonBro,
        Skeletor,
        Orc,
        Goblin,
        Sauron,
        Rhino,
        Placki,
    ];

    BaseCost = NaN;
    BasePower = NaN;

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    static observedAttributes = ["type"];
    attributeChangedCallback(name: string, old_value: string, new_value: string) {
        this.Controller = new CardElement.Controllers[parseInt(new_value) as Sprites](this);
        this.BaseCost = this.Controller.Cost;
        this.BasePower = this.Controller.Power;

        this.Render();
    }

    connectedCallback() {
        DEBUG: if (!this.hasAttribute("type")) {
            throw new Error("CardElement: type attribute is required");
        }

        this.Render();
    }

    Render() {
        this.id = `_${this.Controller.Id}`;

        const target_height = 120;
        const sprite_height = 10;
        const pixel_size = target_height / sprite_height;
        const sprite_y = (sprite_height + 1) * this.Controller.Sprite * pixel_size;

        const spritesheet_src = document.querySelector("img#sheet")?.getAttribute("src");
        const background_url = `url(${spritesheet_src})`;

        const mask_src = document.querySelector("img#mask")?.getAttribute("src");
        const mask_url = `url(${mask_src})`;

        const card_body = html`
            <flex-col start id="cost">
                ${Array.from(
                    {length: this.Controller.CurrentCost},
                    (_, i) => html`<span class="cost ${i >= this.BaseCost && "incr"}"></span>`,
                )}
            </flex-col>
            <span
                id="power"
                class="${this.Controller.CurrentPower > this.BasePower
                    ? "incr"
                    : this.Controller.CurrentPower < this.BasePower
                      ? "decr"
                      : ""}"
            >
                ${this.Controller.CurrentPower}
            </span>
            <div class="sprite"></div>
            <div class="mask"></div>
            <div class="text">
                <div class="name">${this.Controller.Name}</div>
                <div part="desc">${this.Controller.Description}</div>
            </div>
        `;

        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    position: relative;
                    height: 180px;
                    width: 120px;
                    border-radius: 5px;
                    user-select: none;
                }

                :host(:not(.frontside)) {
                    background-image: repeating-linear-gradient(45deg, #fe7 0px, #fd6 10px, #fa8 20px);
                    box-shadow: inset 0 0 0 1px #00000066;
                }

                :host(.unplayable) [part="body"] {
                    filter: contrast(0.3) brightness(1.5);
                    cursor: not-allowed;
                }

                :host > * {
                    visibility: hidden;
                }

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

                [part="body"] {
                    position: absolute;
                    inset: 0;
                    border-radius: 5px;
                    background: ${color_from_seed(this.Controller.Sprite + this.Controller.SpriteOffset)};
                    cursor: pointer;
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

                #cost {
                    position: absolute;
                    inset: 2px 3px auto;
                }

                .cost {
                    width: 10px;
                    height: 10px;
                    margin: 1px 0;
                    border-radius: 50%;
                    background: radial-gradient(circle at 30% 30%, #ffff00, #ffff00aa);
                }

                .cost.incr {
                    background: radial-gradient(circle at 30% 30%, #ff6600, #ff660088);
                }

                #power {
                    position: absolute;
                    inset: 2px 3px auto auto;
                    z-index: 1;
                    color: #fff;
                    font-weight: bold;
                    font-size: 24px;
                }

                #power.decr {
                    color: #ff6600;
                    scale: 3;
                }

                #power.incr {
                    color: #00ff66;
                    scale: 3;
                }

                .text {
                    position: absolute;
                    inset: 120px 0 0;
                    padding: 1px;
                    border-radius: 0 0 5px 5px;
                    background: #00000066;
                    align-content: center;
                    text-align: center;
                    color: #fff;
                }

                .name {
                    font-weight: bold;
                }

                [part="desc"] {
                    font-size: 11px;
                }

                dialog,
                dialog:active {
                    background: transparent !important;
                    outline: none;
                    border: none;
                    width: 30%;
                    scale: 3;
                    overflow: visible;
                    perspective: 800px;
                    position: relative;

                    --x: 50%;
                    --y: 50%;
                }

                dialog card-detail {
                    display: block;
                    width: 120px;
                    height: 180px;

                    margin: auto;
                    padding: 0;

                    position: relative;
                    transform: rotateX(var(--rx)) rotateY(var(--ry));
                    transition: transform 0.1s;

                    border-radius: 5px;
                    background: ${color_from_seed(this.Controller.Sprite + this.Controller.SpriteOffset)};
                    box-shadow: 0 20px 10px -5px #00000088;
                }

                dialog card-detail:hover {
                    transform: rotateX(var(--rx)) rotateY(var(--ry)) scale(1.2);
                }

                dialog [part="desc"] {
                    display: block !important;
                }

                dialog .refl {
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    border-radius: 5px;
                    background-image: radial-gradient(circle at var(--x) var(--y), #ffffff99 0%, transparent 65%);
                }

                dialog::backdrop {
                    background: radial-gradient(#f69d3caa, #3f87a6aa);
                }

                card-modifiers {
                    display: block;

                    position: absolute;
                    inset: 0 70% auto 0;
                    padding: 10px;

                    font-size: 6px;
                    background: #ffffffdd;
                    box-shadow: 0 20px 10px -5px #00000088;
                    border-radius: 5px;
                }

                ::slotted(a-modifier) {
                    display: block;
                }
            </style>

            <flex-col part="body" start onclick="event.stopPropagation(); this.nextElementSibling.showModal();"
                >${card_body}</flex-col
            >

            <dialog onclick="event.stopPropagation(); this.close()">
                <card-detail>
                    <div class="refl"></div>
                    <flex-col start>${card_body}</flex-col>
                </card-detail>
                <card-modifiers>
                    <slot>${this.Controller} doesn't have any active modifiers.</slot>
                </card-modifiers>
            </dialog>
        `;

        let dialog = this.shadowRoot!.querySelector("dialog")!;
        let bbox = dialog.firstElementChild!.getBoundingClientRect();

        dialog.addEventListener("mouseenter", (ev) => {
            bbox = dialog.firstElementChild!.getBoundingClientRect();
        });

        dialog.addEventListener("mousemove", (ev) => {
            let x = ev.clientX - bbox.left;
            let y = ev.clientY - bbox.top;
            let x_percent = x / bbox.width;
            let y_percent = y / bbox.height;
            let x_rotation = (x_percent - 0.5) * 20;
            let y_rotation = (0.5 - y_percent) * 20;

            dialog.style.setProperty("--rx", `${y_rotation}deg`);
            dialog.style.setProperty("--ry", `${x_rotation}deg`);
            dialog.style.setProperty("--x", `${x_percent * 100}%`);
            dialog.style.setProperty("--y", `${y_percent * 100}%`);
        });
    }

    static Compare(a: CardElement, b: CardElement) {
        if (a.Controller.Cost !== b.Controller.Cost) {
            return a.Controller.Cost - b.Controller.Cost;
        } else {
            return a.Controller.Name.localeCompare(b.Controller.Name);
        }
    }
}

customElements.define("a-card", CardElement);
