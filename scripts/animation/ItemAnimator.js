import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";
import { ItemDropper} from "../library/ItemDropper.js";
import { InventoryManipulator } from "../library/InventoryManipulator.js";
import { GeneralSettings } from "../interface/GeneralSettings.js";
import { SystemHelper } from "../system/SystemHelper.js";
import { Helpers } from "../library/Helpers.js";
import { TokenLightingManipulator } from "../library/TokenLightingManipulator.js";

export class ItemAnimator 
{
    static async PostAnimation(fn, ms)
    {
        if (!GeneralSettings.Get(OIF.SETTINGS.GENERAL.USE_ANIMATIONS))
        {
            fn();
        }
        else
        {
            setTimeout(()=> {
                fn()
            }, ms);
        }
    }


    static async GetLandedPosAnimated(options, sequenceIdentifier)
    {
        let [effect] = Sequencer.EffectManager.getEffects({ name: sequenceIdentifier });
        options.landedPosX = effect.targetPosition.x - options.gridSize / 2;
        options.landedPosY = effect.targetPosition.y - options.gridSize / 2;
        
        return options;
    }

    //////////////////////////////////////////////////
    // Get a random position
    //////////////////////////////////////////////////
    static GetLandedPosRandomCorner(options)
    {
        let corners = Helpers.GetCornersOfToken(options.target.document);
        let randomCorner = corners[Math.floor(Math.random() * corners.length)];
        options.landedPosX = randomCorner.x;
        options.landedPosY = randomCorner.y;
        return options;
    }

    //////////////////////////////////////////////////
    // Validate and prepare the data to be usede
    // inside other functions, everything that needs
    // to be validated and prepared should be here
    //////////////////////////////////////////////////
    static ValidateAndPrepare(options)
    {
        // Check if there is no targets
        if (options.targets == null || options.targets == undefined || options.targets.length == 0)
        {
            // Stop the workflow if there is no target
            options.stopWorkflow = true;
            return options;
        }

        // Get the first target (only valid)
        options.target = options.targets[0];

        // Calculate de distance between author and target
        options.distance = canvas.grid.measureDistance(options.author, options.target);

        // Get grid unit size
        options.gridUnitSize = canvas.dimensions.distance;

        // Get grid size
        options.gridSize = canvas.dimensions.size;

        return options;
    }

    /**
     * * MeleeWeaponSingleAttack
     * This is the function responsible for melee weapon attacks with
     * single targets
     */
    static async MeleeWeaponSingleAttack(options)
    {
        ////////////////////////////////////////////////////////////
        // Preparation
        ////////////////////////////////////////////////////////////
        // Validate and prepare for the workflow
        options = ItemAnimator.ValidateAndPrepare(options);
        
        // System-side check distances
        options = await SystemHelper.GetDistances(options);

        // System-side check if item is throwable
        options = await SystemHelper.CheckThrowable(options);

        if (options.stopWorkflow == true) { return; }

        Hooks.call(OIF.HOOKS.WEAPON.MELEE.POST_PREPARE, options);

        // Check if item can be thrown at the current distance
        if (options.throwable && options.distance >= options.meleeWeaponDistance + options.gridUnitSize)
        {
            // Check if the distance is below max distance
            if (options.distance <= options.maxDistance)
            {
                ////////////////////////////////////////////////////////////
                // Thrown Attack
                ////////////////////////////////////////////////////////////
                // TODO: consult system rules to see if we should do a correction to the throw attack

                // Check if item should be removed
                if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.REMOVE_THROWABLE_ITEM))
                {
                    // Remove item from author inventory
                    if (!InventoryManipulator.RemoveItem(options.author, options.item, 1)) 
                    {
                        ui.notifications.error(game.i18n.localize("OIF.Attack.Melee.Error.NotEnough"));
                        return;
                    }
                }

                // Check if animation should be played
                if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.USE_ANIMATIONS) && options.throwAnimation != undefined)
                {
                    // Define throw sequence to be played
                    let SequenceIdentifier = `${options.name}-throw-${options.author.document._id}`;
                    let SequenceEffect = new Sequence(OIF.ID)
                        .effect()
                            .file(options.throwAnimation.source)
                            .atLocation(options.author)
                            .stretchTo(options.target)
                            .name(SequenceIdentifier)
                            .missed(options.miss ?? false)

                    // Play throw sequence
                    await SequenceEffect.play();

                    // Get where the effect landed
                    options = await ItemAnimator.GetLandedPosAnimated(options, SequenceIdentifier);
                }
                else
                {
                    // Get a random place to simulate where the projectile landed
                    options = await ItemAnimator.GetLandedPosRandomCorner(options);
                }

                //////////////////////////////////////////////////////////////
                // Thrown Attack Interaction
                //////////////////////////////////////////////////////////////
                setTimeout(() => {
                    if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.USE_ANIMATIONS))
                    {
                        Hooks.call(OIF.HOOKS.WEAPON.MELEE.THROW.POST_ANIMATION, options);
                    }

                    // Create a copy of the item
                    let ItemCopy = options.item.toObject();
                    ItemCopy.system.quantity = 1;

                    let DidInteract = false;
                    // Check if the item should or not break
                    if(!Helpers.RandomMax(100) <= GeneralSettings.Get(OIF.SETTINGS.GENERAL.DEFAULT_THROWABLE_DESTRUCTION_CHANCE))
                    {
                        // Check if the attack missed and if a item pile should be created
                        if (options.miss && GeneralSettings.Get(OIF.SETTINGS.GENERAL.CREATE_ITEM_PILES_ON_MISS))
                        {
                            // Setup item pile position
                            let ItemPilePosition = {
                                x: options.landedPosX,
                                y: options.landedPosY,
                            }
        
                            // Drop item
                            ItemDropper.DropAt(options.item, 1, ItemPilePosition, options.target.document.elevation);
                        }
                        else if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.ADD_THROWABLE_TO_TARGET_INVENTORY))
                        {
                            // Add item to target's inventory
                            InventoryManipulator.AddItem(options.target, options.item, 1);
                        }
                        else if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.CREATE_ITEM_PILES_ON_HIT))
                        {
                            options = ItemAnimator.GetLandedPosRandomCorner(options);

                            // Setup item pile position
                            let ItemPilePosition = {
                                x: options.landedPosX,
                                y: options.landedPosY,
                            }
        
                            // Drop item
                            ItemDropper.DropAt(options.item, 1, ItemPilePosition, options.target.document.elevation);
                        }
        
                        DidInteract = true;
                    }

                    // Check if poweful impact effect should be played
                    if ((options.throwAnimation.powerful || options.tags.indexOf('powerful') > 0) && GeneralSettings.Get(OIF.SETTINGS.GENERAL.POWERFUL_IMPACT_SHAKE_EFFECT))
                    {
                        CanvasEffects.executeForEveryone('ScreenShake');
                        DidInteract = true;
                    }

                    if (DidInteract)
                    {
                        Hooks.call(OIF.HOOKS.WEAPON.MELEE.THROW.POST_INTERACTION, options);
                    }
                }, options.throwAnimation?.delay?? 0);
            }
            else
            {
                ui.notifications.error(game.i18n.localize("OIF.Attack.Melee.Error.TooFar"));
            }
        }
        else
        {
            // Check if the distance is below max distance
            if (options.distance < options.meleeWeaponDistance + options.gridUnitSize)
            {
                ////////////////////////////////////////////////////////////
                // Melee Attack
                ////////////////////////////////////////////////////////////
                // Check if the animation should be played
                if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.USE_ANIMATIONS) && options.meleeAnimation != undefined)
                {
                    // Define melee sequence to be played
                    let SequenceIdentifier = `${options.name}-melee-${options.author.document._id}`;
                    let SequenceEffect = new Sequence(OIF.ID)
                        .effect()
                            .file(options.meleeAnimation.source)
                            .atLocation(options.author)
                            .stretchTo(options.target)
                            .name(SequenceIdentifier)
                    
                    // Play melee sequence
                    await SequenceEffect.play();
                }
                
                ////////////////////////////////////////////////////////////
                // Melee Attack Interaction
                ////////////////////////////////////////////////////////////
                setTimeout(() => {
                    if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.USE_ANIMATIONS))
                    {
                        Hooks.call(OIF.HOOKS.WEAPON.MELEE.HIT.POST_ANIMATION, options);
                    }
    
                    let DidInteract = false;
                    // Check if poweful impact effect should be played
                    if ((options.meleeAnimation.powerful || options.tags.indexOf('powerful') > 0) && GeneralSettings.Get(OIF.SETTINGS.GENERAL.POWERFUL_IMPACT_SHAKE_EFFECT))
                    {
                        CanvasEffects.executeForEveryone('ScreenShake');
                        DidInteract = true;
                    }
    
                    if (DidInteract)
                    {
                        Hooks.call(OIF.HOOKS.WEAPON.MELEE.HIT.POST_INTERACTION, options);
                    }
                }, options.meleeAnimation?.delay ?? 0);
            }
            else
            {
                ui.notifications.error(game.i18n.localize("OIF.Attack.Melee.Error.TooFar"));
            }
        }
    }

    /**
     * * RangedWeaponSingleAttack
     * This is the function responsible for ranged weapon attacks with
     * single targets
     */
    static async RangedWeaponSingleAttack(options)
    {
        ////////////////////////////////////////////////////////////
        // Preparation
        ////////////////////////////////////////////////////////////
        // Validate and prepare for the workflow
        options = ItemAnimator.ValidateAndPrepare(options);

        // System-side check distances
        options = await SystemHelper.GetDistances(options);

        // System-side check if it consumnes ammo
        options = await SystemHelper.CheckConsumeAmmo(options);

        // System-side check ammo
        options = await SystemHelper.CheckAmmo(options);

        if (options.stopWorkflow == true) { return; }

        Hooks.call(OIF.HOOKS.WEAPON.RANGED.POST_PREPARE, options);

        // Check if the distance is below the maximum distance
        if (options.distance <= options.maxDistance)
        {
            // Check if item has ammo property
            if (options.consumeAmmo)
            {
                ////////////////////////////////////////////////////////////
                // Ranged Ammo Attack
                ////////////////////////////////////////////////////////////
                // Check if item has ammo set
                if (options.ammo == undefined)
                {
                    ui.notifications.error(game.i18n.localize('OIF.Attack.Ranged.Error.NoAmmo'));
                    console.error('Could not find the ammunition item!');
                    return;
                }

                // Create a copy of the ammo item
                options.ammoItem = await options.author.actor.getEmbeddedDocument('Item', options.ammo);

                // Check if animation should be played
                if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.USE_ANIMATIONS) && options.rangedAnimation != undefined)
                {
                    // Define ranged sequence to be played
                    let SequenceIdentifier = `${options.name}-ranged-${options.author.document._id}`;
                    let SequenceEffect = new Sequence(OIF.ID)
                        .effect()
                            .file(options.rangedAnimation.source)
                            .atLocation(options.author)
                            .stretchTo(options.target)
                            .name(SequenceIdentifier)
                            .missed(options.miss ?? false)

                    // Play ranged sequence
                    await SequenceEffect.play();

                    // Get where the effect landed
                    options = await ItemAnimator.GetLandedPosAnimated(options, SequenceIdentifier);
                }
                else
                {
                    // Get a random place to simulate where the projectile landed
                    options = await ItemAnimator.GetLandedPosRandomCorner(options);
                }

                ////////////////////////////////////////////////////////////
                // Ranged Attack Interaction
                ////////////////////////////////////////////////////////////
                setTimeout(() => {
                    if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.USE_ANIMATIONS))
                    {
                        Hooks.call(OIF.HOOKS.WEAPON.RANGED.HIT.POST_ANIMATION, options);
                    }

                    let DidInteract = false;
                    // Check if the item should or not break
                    if (!Helpers.RandomMax(100) <= GeneralSettings.Get(OIF.SETTINGS.GENERAL.DEFAULT_AMMUNITION_DESTRUCTION_CHANCE))
                    {
                        // Check if the attack missed and if a item pile should be created
                        if (options.miss && GeneralSettings.Get(OIF.SETTINGS.GENERAL.CREATE_ITEM_PILES_ON_MISS))
                        {
                            // Setup item pile position
                            let ItemPilePosition = {
                                x: options.landedPosX,
                                y: options.landedPosY,
                            }
        
                            // Drop item
                            ItemDropper.DropAt(options.ammoItem, 1, ItemPilePosition, options.target.document.elevation);
                        }
                        else if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.ADD_AMMUNITION_TO_TARGET_INVENTORY))
                        {
                            // Add item to target's inventory
                            InventoryManipulator.AddItem(options.target, options.ammoItem, 1);
                        }
                        else if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.CREATE_ITEM_PILES_ON_HIT))
                        {
                            options = ItemAnimator.GetLandedPosRandomCorner(options);

                            // Setup item pile position
                            let ItemPilePosition = {
                                x: options.landedPosX,
                                y: options.landedPosY,
                            }
        
                            // Drop item
                            ItemDropper.DropAt(options.ammoItem, 1, ItemPilePosition, options.target.document.elevation);
                        }
        
                        DidInteract = true;
                    }

                    // Check if poweful impact effect should be played
                    if ((options.rangedAnimation.powerful || options.tags.indexOf('powerful') > 0) && GeneralSettings.Get(OIF.SETTINGS.GENERAL.POWERFUL_IMPACT_SHAKE_EFFECT))
                    {
                        CanvasEffects.executeForEveryone('ScreenShake');
                        DidInteract = true;
                    }

                    if (DidInteract)
                    {
                        Hooks.call(OIF.HOOKS.WEAPON.RANGED.HIT.POST_INTERACTION, options);
                    }
                }, options.rangedAnimation?.delay ?? 0);
            }
            else
            {
                ////////////////////////////////////////////////////////////
                // Ranged Attack
                ////////////////////////////////////////////////////////////
                // Check if animation should be played
                if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.USE_ANIMATIONS) && options.rangedAnimation != undefined)
                {
                    // Define ranged sequence to be played
                    let SequenceIdentifier = `${options.name}-ranged-${options.author.document._id}`;
                    let SequenceEffect = new Sequence(OIF.ID)
                        .effect()
                            .file(options.rangedAnimation.source)
                            .atLocation(options.author)
                            .stretchTo(options.target)
                            .name(SequenceIdentifier)
                            .missed(options.miss ?? false)

                    // Play ranged sequence
                    await SequenceEffect.play();

                    Hooks.call(OIF.HOOKS.WEAPON.RANGED.HIT.POST_ANIMATION, options);
                }
            }
        }
        else
        {
            ui.notifications.error(game.i18n.localize('OIF.Attack.Ranged.Error.TooFar'));
        }
    }
}