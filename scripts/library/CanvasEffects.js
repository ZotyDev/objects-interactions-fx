//                          ███████    █████ ███████████                      //
//                        ███░░░░░███ ░░███ ░░███░░░░░░█                      //
//                       ███     ░░███ ░███  ░███   █ ░                       //
//                      ░███      ░███ ░███  ░███████                         //
//                      ░███      ░███ ░███  ░███░░░█                         //
//                      ░░███     ███  ░███  ░███  ░                          //
//                       ░░░███████░   █████ █████                            //
//                         ░░░░░░░    ░░░░░ ░░░░░                             //
//        Automated Objects, Interactions and Effects -  By ZotyDev           //
////////////////////////////////////////////////////////////////////////////////
//? This module provides effects that are played on the canvas such as making
//? the screen shake.
//! Credits to kandashi and ChueyB, they made this section of OIF possible
//TODO provide these effects on a API to support integration with other modules
////////////////////////////////////////////////////////////////////////////////
import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";

export class CanvasLayer extends InteractionLayer 
{
    constructor(...args)
    {
        super(...args);

        this.mouseInteractionManager = null;

        this._interactiveChildren = false;
        this._dragging = false;

        this.options = this.constructor.layerOptions;
    }

    async _draw(options)
    {
    }

    ////////////////////////////////////////////////////////////////////////////
    // Shakes the canvas
    //TODO make the Intensity, duration and iterations a argument
    ////////////////////////////////////////////////////////////////////////////
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