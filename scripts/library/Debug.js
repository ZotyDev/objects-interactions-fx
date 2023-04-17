import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";

export class Debug
{
    static Initialize()
    {
        Debug._enabled    = game.settings.get(OIF.ID, OIF.SETTINGS.GENERAL.DEVELOPER_MODE);
        Debug._errorStack = {};
        Debug._logStack   = {};
        Debug._warnStack  = {};

        Hooks.on(OIF.HOOKS.CHANGE_SETTINGS, (settings) =>
        {
            Debug._enabled = settings[OIF.SETTINGS.GENERAL.DEVELOPER_MODE].value;
        });
    }

    static Error(...args)
    {
        if (Debug._enabled)
        {
            console.error('OIF DEBUG - ERROR - ', ...args);
        }
    }

    static Log(...args)
    {
        if (Debug._enabled)
        {
            console.log('OIF DEBUG - LOG - ', ...args);
        }
    }

    static Warn(...args)
    {
        if (Debug._enabled)
        {
            console.warn('OIF DEBUG - WARN - ', ...args);
        }
    }

    static ErrorStack(id, ...args)
    {
        if (Debug._enabled)
        {
            if (Debug._errorStack[id] == undefined)
            {
                Debug._errorStack[id] = [];
            }

            Debug._errorStack[id].push(args);
        }
    }

    static LogStack(id, ...args)
    {
        if (Debug._enabled)
        {
            if (Debug._logStack[id] == undefined)
            {
                Debug._logStack[id] = [];
            }

            Debug._logStack[id].push(args);
        }
    }

    static WarnStack(id, ...args)
    {
        if (Debug._enabled)
        {
            if (Debug._warnStack[id] == undefined)
            {
                Debug._warnStack[id] = [];
            }

            Debug._warnStack[id].push(args);
        }
    }

    static FlushErrorStack(id)
    {
        if (Debug._enabled)
        {
            if (Debug._errorStack[id] != undefined)
            {
                console.error('OIF DEBUG - ERROR STACK - ', id, ...Debug._errorStack[id]);
                Debug._errorStack[id] = [];
            }
        }
    }

    static FlushLogStack(id)
    {
        if (Debug._enabled)
        {
            if (Debug._logStack[id] != undefined)
            {
                console.log('OIF DEBUG - LOG STACK - ', id, ...Debug._logStack[id]);
                Debug._logStack[id] = [];
            }
        }
    }

    static FlushWarnStack(id)
    {
        if (Debug._enabled)
        {
            if (Debug._warnStack[id] != undefined)
            {
                console.warn('OIF DEBUG - WARN STACK - ', id, ...Debug._warnStack[id]);
                Debug._warnStack[id] = [];
            }
        }
    }
}