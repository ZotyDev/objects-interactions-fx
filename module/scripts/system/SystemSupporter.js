import { DnD5e } from './systems/dnd5e.js'
import { Pf2e }  from './systems/pf2e.js'

export class SystemSupporter 
{
    static Initialize()
    {
        switch (game.system.id)
        {
            case 'dnd5e': SystemSupporter._provider = DnD5e ; break;
            case 'pf2e' : SystemSupporter._provider = Pf2e  ; break;
        }
    }

    static _provider = {}

    static GetDefaultTagPack()            { return SystemSupporter._provider.GetDefaultTagPack()     ; }

    static GetDefaultHookAttack()         { return SystemSupporter._provider.GetDefaultHookAttack()  ; }
    static GetDefaultHookItem()           { return SystemSupporter._provider.GetDefaultHookItem()    ; }
    static GetPossibleHooksAttack()       { return SystemSupporter._provider.GetPossibleHooksAttack(); }
    static GetPossibleHooksItem()         { return SystemSupporter._provider.GetPossibleHooksItem()  ; }

    static async ExtractOptions(workflow, source, from) { return await SystemSupporter._provider.ExtractOptions(workflow, source, from); }
}