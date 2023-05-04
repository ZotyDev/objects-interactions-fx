////////////////////////////////////////////////////////////////////////////////
//                          ███████    █████ ███████████                      //
//                        ███░░░░░███ ░░███ ░░███░░░░░░█                      //
//                       ███     ░░███ ░███  ░███   █ ░                       //
//                      ░███      ░███ ░███  ░███████                         //
//                      ░███      ░███ ░███  ░███░░░█                         //
//                      ░░███     ███  ░███  ░███  ░                          //
//                       ░░░███████░   █████ █████                            //
//                         ░░░░░░░    ░░░░░ ░░░░░                             //
//        Automated Objects, Interactions and Effects  -  By ZotyDev          //
////////////////////////////////////////////////////////////////////////////////
import { Constants as C } from "./Constants.js";

//? The Debugger is the class that provides OIF with debugging tools that are
//? used to either development or bug hunting, the use of the Debugger does not
//? affect the end user, being it enabled or not, it only changes what is shown
//? at the console window
//! This is a singleton class, which means that it should be not instanciated
export class Debugger
{
    ////////////////////////////////////////////////////////////////////////////
    // Initializes the debug environment
    ////////////////////////////////////////////////////////////////////////////
    static Initialize()
    {
        Debugger._enabled    = Wizard.Get(C.ID, C.SETTINGS.GENERAL.ENABLE_DEBUG);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Prints a error to the console if the debug mode is active
    ////////////////////////////////////////////////////////////////////////////
    static Error(...args)
    {
        if (Debugger._enabled)
        {
            console.error('OIF !DEBUG! - ERROR -', ...args);
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Prints a log to the console if the debug mode is active
    ////////////////////////////////////////////////////////////////////////////
    static Log(...args)
    {
        if (Debugger._enabled)
        {
            console.log('OIF !DEBUG! - LOG -', ...args);
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Prints a wanr to the console if the debug mode is active
    ////////////////////////////////////////////////////////////////////////////
    static Warn(...args)
    {
        if (Debugger._enabled)
        {
            console.warn('OIF !DEBUG! - WARN -', ...args);
        }
    }
}