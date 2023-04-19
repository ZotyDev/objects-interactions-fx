import { CanvasLayer } from './CanvasEffects.js';
import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";
import { MasterTagsSettings } from '../interface/MasterTagsSettings.js';

let Socket;

Hooks.on('socketlib.ready', () =>
{
    Socket = socketlib.registerModule(OIF.ID);

    // Canvas effects
    Socket.register('ScreenShake', CanvasLayer.ScreenShake);

    // Tags
    Socket.register('LoadFromConfig', MasterTagsSettings.LoadFromConfig);

    window.OIF_SOCKET = Socket;
})