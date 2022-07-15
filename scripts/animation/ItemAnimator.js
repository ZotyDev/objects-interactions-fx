import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";
import { ItemDropper} from "../library/ItemDropper.js";
import { InventoryManipulator } from "../library/InventoryManipulator.js";

export class ItemAnimator 
{
    static async MeleeSingleAttack(item, author, target, options)
    {
        // Check if there is a target
        if (target == null || target == undefined)
        {
            return;
        }

        // Calculate distance
        let Distance = canvas.grid.measureDistance(author, target);

        // Caculate the melee attack distance of the item
        let WeaponMeleeDistance = canvas.dimensions.distance;
        if (item.data.data.properties.rch) {
            WeaponMeleeDistance += WeaponMeleeDistance;
        }

        // Is the Item a throwable and outside of melee range?
        if (item.data.data.properties.thr == true && Distance >= WeaponMeleeDistance + canvas.dimensions.distance)
        {
            // Check if item should be removed
            if (game.settings.get(OIF.ID, "removeThrowableItem"))
            {
                // Remove item from author inventory
                if (!InventoryManipulator.RemoveItem(author, item, 1)) 
                {
                    ui.notifications.error(game.i18n.localize("OIF.Attack.Melee.Error.NotEnough"));
                    return;
                }
            }

            // Call hook
            Hooks.call(OIF.HOOKS.WEAPON.MELEE.THROW.PRE, options);

            // Define throw sequence to be played
            let SequencerHelper = `${options.name}-throw-${author.data._id}`;
            let SequencerEffect = new Sequence()
                .effect()
                    .file(options.throwAnimation.effect)
                    .atLocation(author)
                    .stretchTo(target)
                    .name(SequencerHelper)
                    .missed(options.miss)
                    .waitUntilFinished(-600)
            
            // Play throw sequence
            await SequencerEffect.play();

            // Get results from played sequence
            let [Effect] = Sequencer.EffectManager.getEffects({ name: SequencerHelper });
            options.landedPosX = Effect.targetPosition.x - canvas.dimensions.size / 2;
            options.landedPosY = Effect.targetPosition.y - canvas.dimensions.size / 2;

            // Call hook
            Hooks.call(OIF.HOOKS.WEAPON.MELEE.THROW.POS, options);

            // Create a copy of the item
            let ItemCopy = item.toObject();
            ItemCopy.data.quantity = 1;

            // Check if the attack missed and if a item pile should be created
            if (options.miss && OIF.SETTINGS.LOADED_MODULES.ITEM_PILES && game.settings.get(OIF.ID, "createItemPilesOnMiss")) {
                // Get the position where the item landed
                let ItemPilePosition = {
                    x: options.landedPosX,
                    y: options.landedPosY,
                }

                // Drop item
                ItemDropper.DropAt(item, 1, ItemPilePosition, target.data.elevation);
            }
            else if (game.settings.get(OIF.ID, "addThrowableToTargetInventory"))
            {
                // Add the item to Target's inventory
                InventoryManipulator.AddItem(target, item, 1);
            }
        }
        else
        {
            // Call hook
            Hooks.call(OIF.HOOKS.WEAPON.MELEE.HIT.PRE, options);

            // Define melee sequence to be played
            let SequencerHelper = `${options.name}-melee-${author.data._id}`;
            let SequencerEffect = new Sequence()
                .effect()
                    .file(options.meleeAnimation.effect)
                    .atLocation(author)
                    .stretchTo(target)
                    .name(SequencerHelper)
                    .waitUntilFinished(options.meleeAnimation.powerfulDelay ?? 0)
            
            // Play melee sequence
            await SequencerEffect.play();

            // Call hook
            Hooks.call(OIF.HOOKS.WEAPON.MELEE.HIT.POS, options);

            // Check if impact effect should be played
            if (options.meleeAnimation.powerful == true && game.settings.get(OIF.ID, "powerfulImpactShakeEffect")) {
                KFC.executeForEveryone("earthquake", 1, 500, 1)
            }
        }
    }
    
    static async RangedSingleAttack(item, author, target, options)
    {
        // Check if there is a target
        if (target == null || target == undefined)
        {
            return;
        }

        // Check if item has ammunition property
        if (item.data.data.properties.amm == true) 
        {
            // Check if item has ammunition set
            if (item.data.data.consume.target == "") 
            {
                ui.notifications.error(game.i18n.localize("OIF.Attack.Ranged.Error.1"));
                console.error("Could not find the ammunition item!");
                return;
            }
            else
            {
                // Create a copy of the ammunition item
                options.ammunitionItem = await author.actor.getEmbeddedDocument("Item", item.data.data.consume.target);

                // Call hook
                Hooks.call(OIF.HOOKS.WEAPON.RANGED.HIT.PRE, options);

                // Define ranged sequence to be played
                let SequencerHelper = `${options.name}-ranged-${author.data._id}`;
                let SequencerEffect = new Sequence()
                    .effect()
                        .file(options.rangedAnimation.effect)
                        .atLocation(author)
                        .stretchTo(target)
                        .name(SequencerHelper)
                        .missed(options.miss)
                        .waitUntilFinished(-1150)

                // Play ranged sequence
                await SequencerEffect.play();

                //// Call hook
                //Hooks.call(OIF.HOOKS.WEAPON.RANGED.HIT.SOUND.PRE);
                //
                //// Define sound sequence to be played
                //let SequencerSound = new Sequence()
                //    .sound()
                //        .file(option)
                //        .volume(1.0)
                //        .startTime(500)
                //
                //// Play sound sequence
                //SequencerSound.play();

                // Get results from played sequence
                let [Effect] = Sequencer.EffectManager.getEffects({ name: SequencerHelper });
                options.landedPosX = Effect.targetPosition.x - canvas.dimensions.size / 2;
                options.landedPosY = Effect.targetPosition.y - canvas.dimensions.size / 2;

                // Call hook
                Hooks.call(OIF.HOOKS.WEAPON.RANGED.HIT.POS, options);

                // Check if Item Pile should be created
                if (options.miss && OIF.SETTINGS.LOADED_MODULES.ITEM_PILES && game.settings.get(OIF.ID, "createItemPilesOnMiss"))
                {
                    // Get the position where the item landed
                    let ItemPilePosition = {
                        x: options.landedPosX,
                        y: options.landedPosY,
                    }

                    // Drop item
                    ItemDropper.DropAt(options.ammunitionItem, 1, ItemPilePosition, target.data.elevation)
                }
                else if (game.settings.get(OIF.ID, "addAmmunitionToTargetInventory"))
                {
                    // Add the ammunition to Target's inventory
                    InventoryManipulator.AddItem(target, options.ammunitionItem, 1);
                }
            }
        }
        else 
        {
            // Define ranged sequence to be played
            let SequencerHelper = `${options.name}-ranged-${author.data._id}`;
            let SequencerEffect = new Sequence()
                .effect()
                    .file(options.rangedAnimation.effect)
                    .atLocation(author)
                    .stretchTo(target)
                    .name(SequencerHelper)
                    .missed(options.miss)

            // Play ranged sequence
            await SequencerEffect.play();
        }
    }
}