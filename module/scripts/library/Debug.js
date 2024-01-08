////////////////////////////////////////////////////////////////////////////////
//                              ____ _____ ______                             //
//                             / __ \_   _|  ____|                            //
//                            | |  | || | | |__                               //
//                            | |  | || | |  __|                              //
//                            | |__| || |_| |                                 //
//                             \____/_____|_|                                 //
//         Automated Objects, Interactions and Effects -  By ZotyDev          //
////////////////////////////////////////////////////////////////////////////////
// ? This class contains a helper for debugging, it only prints the passed
// ? information when the Debug flag is active
import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";
export class Debug
{
    static Options = {
        enabled: false
    }

    ////////////////////////////////////////////////////////////////////////////
    // Initializes the Debug module, should be inserted before anything else
    ////////////////////////////////////////////////////////////////////////////
    static Initialize()
    {
        // Check if the debug should be enabled
        Debug.Options.enabled = game.settings.get(OIF.ID, OIF.SETTINGS.GENERAL.DEVELOPER_MODE);

        // Update when settings are changed
        Hooks.on(OIF.HOOKS.CHANGE_SETTINGS, (settings) =>
        {
            Debug.Options.enabled = settings[OIF.SETTINGS.GENERAL.DEVELOPER_MODE].value;
        });
    }

    ////////////////////////////////////////////////////////////////////////////
    // Outputs a error, must always be shown
    ////////////////////////////////////////////////////////////////////////////
    static Error(...args) {
        console.error('OIF ERROR - ', ...args);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Outputs a log, should be shown ONLY when the debug mode is active
    ////////////////////////////////////////////////////////////////////////////
    static Log(...args) {
        if (Debug.Options.enabled) {
            console.log('OIF DEBUG - ', ...args);
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Outputs a warning, should be shown ONLY when the debug mode is active
    ////////////////////////////////////////////////////////////////////////////
    static Warn(...args) {
        if (Debug.Options.enabled) {
            console.warn('OIF WARN - ', ...args);
        }
    }
}
