import { DnD5e } from "../system/predefined/dnd5e.js";

export class SystemHelper 
{
    static _FindMethod(methodName, options)
    {
        switch (game.system.id)
        {
            case 'dnd5e':
            {
                return DnD5e.Methods[methodName](options);
            }
        }
    }

    
    static async GetOptionsFromWeaponRoll(workflow)
    {
        return SystemHelper._FindMethod('GetOptionsFromWeaponRoll', workflow);
    }

    static async GetOptionsFromItemRoll(workflow)
    {
        return SystemHelper._FindMethod('GetOptionsFromItemRoll', workflow);
    }

    static async GetDefaultTagPack()
    {
        return SystemHelper._FindMethod('GetDefaultTagPack');
    }
    
    static async GetDistances(options)
    {
        return SystemHelper._FindMethod('GetDistances', options);
    }

    static async CheckThrowable(options)
    {
        return SystemHelper._FindMethod('CheckThrowable', options);
    }

    static async CheckConsumeAmmo(options)
    {
        return SystemHelper._FindMethod('CheckConsumeAmmo', options);
    }

    static async CheckAmmo(options)
    {
        return SystemHelper._FindMethod('CheckAmmo', options);
    }
}