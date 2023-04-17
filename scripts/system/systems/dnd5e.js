import { ObjectsInteractionsFX     as OIF  } from "../../ObjectsInteractionsFX.js";
import { ObjectsInteractionsFXData as OIFD } from "../../data/ObjectsInteractionsFXData.js";

import { Debug                     as DBG  } from "../../library/Debug.js";

export class DnD5e
{
    ////////////////////////////////////////////////////////////
    // Return the default hooks
    ////////////////////////////////////////////////////////////
    static GetDefaultHookAttack() { return 'dnd5e.rollAttack'; }
    static GetDefaultHookItem()   { return 'dnd5e.useItem'   ; }

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
                name : 'OIF.Settings.AttachHooks.Attack.DnD5eAfterAttackRoll.Label',
                value: 'dnd5e.rollAttack',
            },
            {
                name : 'OIF.Settings.AttachHooks.Attack.DnD5eAfterDamageRoll.Label',
                value: 'dnd5e.rollDamage',
            }
        ]
        // MidiQOL hooks
        const MidiQOL =
        [
            {
                name : 'OIF.Settings.AttachHooks.Attack.MidiQOLAfterAttackRoll.Label',
                value: 'midi-qol.AttackRollComplete',
                disabled: !OIF.OPTIONAL_MODULES.MIDI_QOL?.active,
                disabledMessage: 'OIF.Settings.AttachHooks.Attack.MidiQOLAfterAttackRoll.DisabledMessage',
            },
            {
                name : 'OIF.Settings.AttachHooks.Attack.MidiQOLAfterDamageRoll.Label',
                value: 'midi-qol.DamageRollComplete',
                disabled: !OIF.OPTIONAL_MODULES.MIDI_QOL?.active,
                disabledMessage: 'OIF.Settings.AttachHooks.Attack.MidiQOLAfterDamageRoll.DisabledMessage',
            },
            {
                name : 'OIF.Settings.AttachHooks.Attack.MidiQOLAfterCompleteRoll.Label',
                value: 'midi-qol.RollComplete',
                disabled: !OIF.OPTIONAL_MODULES.MIDI_QOL?.active,
                disabledMessage: 'OIF.Settings.AttachHooks.Attack.MidiQOLAfterCompleteRoll.DisabledMessage',
            }
        ]

        return System.concat(MidiQOL);
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
                name : 'OIF.Settings.AttachHooks.Item.DnD5AfterItemRoll.Label',
                value: 'dnd5e.useItem',
            }
        ]

        return System;
    }

    ////////////////////////////////////////////////////////////
    // Function that is called when a hook is triggered, note
    // that this function is called for every hook, so it is
    // important make sure the data we are extracting is the
    // one we want 
    //
    // (for example, if we are using MidiQOL, we only want to
    // extract data from the MidiQOL hooks)
    ////////////////////////////////////////////////////////////
    static async ExtractOptions(workflow, source, from)
    {
        // Check if MidiQOL is active and if the hook is the one from MidiQOL
        let ShouldUseMidiQOL = OIF.OPTIONAL_MODULES.MIDI_QOL?.active;
        ShouldUseMidiQOL     = ShouldUseMidiQOL && source == 'attack';
        let UsedHook         = from;
        let DidUseMidiHook   = UsedHook == 'midi-qol.AttackRollComplete' || UsedHook == 'midi-qol.DamageRollComplete' || UsedHook == 'midi-qol.RollComplete';
        ShouldUseMidiQOL     = ShouldUseMidiQOL && DidUseMidiHook;

        if (ShouldUseMidiQOL)
        {
            DBG.Log('Using MidiQOL hook', source, from, workflow);

            // Retrieve the item
            let Item = workflow[0].item;

            // Retrieve the item's tags
            let Tags = await OIFD.GetData(Item);

            // Retrieve the token
            let Token = await canvas.tokens.get(workflow[0].tokenId);

            // Retrieve the targets
            let Targets = Array.from(game.user.targets);
            let HitTargets = workflow[0].hitTargets;

            // Special treatment
            let DidMiss;
            switch (source)
            {
                case 'attack':
                    {
                        // Did it miss?
                        DidMiss = HitTargets.length === 0 ?? false;

                        break;
                    }
                case 'item':
                    {
                        // Did it miss?
                        DidMiss = false;

                        break;
                    }
            }

            // Set the options
            let Options =
            {
                name      : Tags[0],
                item      : Item,
                tags      : Tags,
                actor     : Token.actor,
                token     : Token,
                targets   : Targets,
                hitTargets: HitTargets,
                miss      : HitTargets.length === 0 ?? false,
                type      : source,
                dice      : 
                {
                    roll    : workflow[0].roll,
                    total   : workflow[0].attackTotal,
                    critical: workflow[0].isCritical,
                    fumble  : workflow[0].isFumble,
                },
                system     :
                {
                    name               : 'dnd5e',
                    meleeWeaponDistance: canvas.dimensions.distance,
                    normalDistance     : Item.system.range.value,
                    longDistance       : Item.system.range.long,
                    isThrowable        : Item.system.properties.thr,
                    isConsumeAmmo      : Item.system.properties.amm,
                    ammoItem           : Item.system.consume.target,
                },
            }

            // Recalculate melee weapon distance if the item has the reach tag
            if (Item.system.properties.rch) { Options.system.meleeWeaponDistance *= 2; }

            return Options;
        }
        // If Midi QOL is not active
        else
        {
            DBG.Log('Using default hook', source, from, workflow);

            // Retrieve the item
            let Item = workflow[0];

            // Retrieve the item's tags
            let Tags = await OIFD.GetData(Item);

            // Retrieve the actor and token
            let Actor = Item.parent;
            let Token = Actor.token?.object ?? Actor.getActiveTokens()[0];

            // Retrieve the targets
            let Targets = Array.from(game.user.targets);
            let HitTargets = Targets.filter(t => t.actor.system.attributes.ac.value <= workflow[1].total);

            // Special treatment
            let RollTotal = undefined;
            let DidMiss   = false;
            switch (source)
            {
                case 'attack':
                    {
                        // Did it miss?
                        DidMiss = workflow[1].isCritical ? false : HitTargets.length === 0 ?? false;

                        // Retrieve the roll total
                        let UsedDice = workflow[1].dice[0].results;
                        UsedDice.filter((d) => d.active);
                        RollTotal = UsedDice.reduce((a, b) => a + b.result, 0);

                        break;
                    }
                case 'item':
                    {
                        // Did it miss?
                        DidMiss = false;

                        break;
                    }
            }

            // Set the options
            let Options =
            {
                name      : Tags[0],
                item      : Item,
                tags      : Tags,
                actor     : Actor,
                token     : Token,
                targets   : Targets,
                hitTargets: HitTargets,
                miss      : DidMiss,
                type      : source,
                dice      : 
                {
                    roll    : RollTotal,
                    total   : workflow[1]?._total,
                    critical: workflow[1]?.isCritical,
                    fumble  : workflow[1]?.isFumble,
                },
                system     :
                {
                    name               : 'dnd5e',
                    meleeWeaponDistance: canvas.dimensions.distance,
                    normalDistance     : Item.system.range.value,
                    longDistance       : Item.system.range.long,
                    isThrowable        : Item.system.properties?.thr,
                    isConsumeAmmo      : Item.system.properties?.amm,
                    ammoItem           : Item.system.consume?.target,
                },
            }

            // Recalculate melee weapon distance if the item has the reach tag
            if (Item.system.properties?.rch) { Options.system.meleeWeaponDistance *= 2; }

            return Options;
        }
    }
}