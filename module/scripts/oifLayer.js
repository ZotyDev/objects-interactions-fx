////////////////////////////////////////////////////////////////////////////////
//                              ____ _____ ______                             //
//                             / __ \_   _|  ____|                            //
//                            | |  | || | | |__                               //
//                            | |  | || | |  __|                              //
//                            | |__| || |_| |                                 //
//                             \____/_____|_|                                 //
//                                                   By ZotyDev               //
////////////////////////////////////////////////////////////////////////////////
// ? Class that defines the layer for interaction.
import { Constants as C } from "./constants.js";

export class OifLayer extends InteractionLayer {
  constructor() {
    super();

    if (game.release.generation == 10) {
      // Debug
      C.D.info('Detected FoundryVTT 10, making compatibility changes...');

      this.loader = new PIXI.loader();
    }

    this.mouseInteractionManager = undefined;
    this._interactiveChildren = false;
    this._dragging = false;
    this.options = this.constructor.layerOptions;
  }

  async _draw(options) {}
}
