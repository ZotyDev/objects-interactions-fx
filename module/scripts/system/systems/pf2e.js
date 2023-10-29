import { ObjectsInteractionsFX     as OIF  } from "../../ObjectsInteractionsFX.js";

import { Debug                     as DBG  } from "../../library/Debug.js";

export class Pf2e
{
    ////////////////////////////////////////////////////////////
    // Return the default hooks
    ////////////////////////////////////////////////////////////
    static GetDefaultHookAttack() { return 'createChatMessage'; }
    static GetDefaultHookItem()   { return 'createChatMessage'; }

    ////////////////////////////////////////////////////////////
    // Return the default tag pack
    ////////////////////////////////////////////////////////////
    static GetDefaultTagPack()
    {
        if (game.modules.get('jb2a_patreon')?.active)
        {
            return 'DefaultFantasyTagsJB2AComplete';
        }
        else if (game.modules.get('JB2A_DnD5e')?.active)
        {
            return 'DefaultFantasyTagsJB2AFree';
        }
        else
        {
            return 'DefaultFantasyTagsNoAnimations';
        }
    }

    ////////////////////////////////////////////////////////////
    // Return all the hooks that can be used to get attack info
    ////////////////////////////////////////////////////////////
    static GetPossibleHooksAttack()
    {
        // System hooks
        const System =
        [
            {
                name : 'OIF.Settings.AttachHooks.Attack.Pf2eAfterAttackRoll.Label',
                value: 'createChatMessage',
            }
        ]

        return System;
    }

    ////////////////////////////////////////////////////////////
    // Return all the hooks that can be used to get item info
    ////////////////////////////////////////////////////////////
    static GetPossibleHooksItem()
    {
        // System hooks
        const System =
        [
            {
                name : 'OIF.Settings.AttachHooks.Item.Pf2eAfterItemRoll.Label',
                value: 'createChatMessage',
            }
        ]

        return System;
    }

    ////////////////////////////////////////////////////////////
    // Function that is called when a hook is triggered, note
    // that this function is called for every hook, so it is
    // important make sure the data we are extracting is the
    // one we want
    ////////////////////////////////////////////////////////////
    static async ExtractOptions(workflow, source, from)
    {
        DBG.Log('Using default hook', source, from, workflow);

        // Retrieve the item
        let Item = workflow[0].item;

        // Retrieve the item's tags;
        let Tags = ItemTags.Get(Item);

        // Retrieve the token
        let Token = canvas.tokens.get(workflow[0].token._id);

        // Retrieve the targets
        let Targets = Array.from(game.user.targets);
        let HitTargets = Targets.filter((t) => true);

        // Special treatment
        let RollTotal = undefined;
        let DidMiss   = false;
        let DidCrit   = false;
        let DidFumble = false;
        switch (source)
        {
            case 'attack':
                {
                    // Did it miss?
                    let Outcome = workflow[0].flags.pf2e.context?.outcome ?? "";
                    switch (Outcome)
                    {
                        case 'criticalFailure': DidMiss = true ; DidFumble = true; break;
                        case 'failure'        : DidMiss = true ;                   break;
                        case 'success'        : DidMiss = false;                   break;
                        case 'criticalSuccess': DidMiss = false; DidCrit   = true; break;
                        default               : DidMiss = false;                   break;
                    }

                    // Get the roll total
                    RollTotal = workflow[0].rolls._total;

                    break;
                }
            case 'item':
                {
                    // Did it miss?
                    DidMiss = false;
                    break;
                }
        }

        let IsThrowable = false;
        let ThrowableDistance = undefined;
        Item.system.traits.value.forEach((trait) =>
        {
            if (trait == 'thrown')
            {
                IsThrowable = true;
                ThrowableDistance = Item.system.range * 7;
            }
            else if (trait.includes('thrown'))
            {
                IsThrowable = true;
                ThrowableDistance = parseInt(trait.split('-')[1]) * 7;
            }
        });

        let Options =
        {
            name      : Tags[0],
            item      : Item,
            tags      : Tags,
            actor     : Token.actor,
            token     : Token,
            targets   : Targets,
            hitTargets: HitTargets,
            miss      : DidMiss,
            type      : source,
            dice      :
            {
                roll     : undefined,
                total    : RollTotal,
                critical : DidCrit,
                fumble   : DidFumble,
            },
            system    :
            {
                name               : 'pf2e',
                meleeWeaponDistance: canvas.dimensions.distance,
                normalDistance     : IsThrowable ? canvas.dimensions.distance : Item.system.range,
                longDistance       : IsThrowable ? ThrowableDistance : Item.system.range,
                isThrowable        : IsThrowable,
                isConsumeAmmo      : false,
                ammoItem           : ''
            }
        }

        return Options;
    }
}
