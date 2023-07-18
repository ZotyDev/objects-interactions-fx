////////////////////////////////////////////////////////////
// The credits of this code goes to kandashi and ChueyB
// I've just copied the sections that OIF uses, I actually
// have no idea how it works or why it works, in the future
// I will improve this section of OIF, but for now
// this is good enough
//
// Thank you kandashi and ChueyB :D
////////////////////////////////////////////////////////////
import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";

export class CanvasLayer extends InteractionLayer 
{
    constructor()
    {
        super();

        this.mouseInteractionManager = null;

        this._interactiveChildren = false;
        this._dragging = false;

        this.options = this.constructor.layerOptions;
    }

    async _draw(options)
    {
    }

    static ScreenShake()
    {
        let Intensity = 1;
        let a = 1 * Intensity;
        let b = 2 * Intensity;
        let c = 3 * Intensity;
        document.getElementById('board').animate([
            { transform: `translate(${a}px, ${a}px) rotate(0deg)` },
            { transform: `translate(-${a}px, -${b}px) rotate(-${a}deg)` },
            { transform: `translate(-${c}px, 0px) rotate(${a}deg)` },
            { transform: `translate(${c}px, ${b}px) rotate(0deg)` },
            { transform: `translate(${a}px, -${a}px) rotate(${a}deg)` },
            { transform: `translate(-${a}px, ${b}px) rotate(-${a}deg)` },
            { transform: `translate(-${c}px, ${a}px) rotate(0deg)` },
            { transform: `translate(${c}px, ${a}px) rotate(-${a}deg)` },
            { transform: `translate(-${a}px, -${a}px) rotate(${a}deg)` },
            { transform: `translate(${a}px, ${b}px) rotate(0deg)` },
            { transform: `translate(${a}px, -${b}px) rotate(-${a}deg)` }
        ],
        {
            duration: 500,
            iterations: 1
        });
    }
}

Hooks.on('init', () => {
    CONFIG.Canvas.layers['CanvasEffects'] = {
        group: 'interface',
        layerClass: CanvasLayer
    };
})