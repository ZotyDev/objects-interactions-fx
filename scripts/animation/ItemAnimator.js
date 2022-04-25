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

        // Is the Item a throwable?
        if (item.data.data.properties.thr == true && Distance >= 3.0)
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

            // Define throw sequence to be played
            let SequencerHelper = `${options.name}-throw-${author.data._id}`;
            let SequencerEffect = new Sequence()
                .effect()
                    .file(options.throwAnimation)
                    .atLocation(author)
                    .stretchTo(target)
                    .name(SequencerHelper)
                    .missed(options.miss)
            
            // Play throw sequence
            await SequencerEffect.play();

            // Get results from played sequence
            let [Effect] = Sequencer.EffectManager.getEffects({ name: SequencerHelper });

            // Create a copy of the item
            let ItemCopy = item.toObject();
            ItemCopy.data.quantity = 1;

            // Check if the attack missed and if a item pile should be created
            if (options.miss && OIF.SETTINGS.LOADED_MODULES.ITEM_PILES && game.settings.get(OIF.ID, "createItemPilesOnMiss")) {
                // Get the position where the item landed
                let ItemPilePosition = {
                    x: Effect.targetPosition.x - 50,
                    y: Effect.targetPosition.y - 50
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
            // Define melee sequence to be played
            let SequencerHelper = `${options.name}-melee-${author.data._id}`;
            let SequencerEffect = new Sequence()
                .effect()
                    .file(options.meleeAnimation)
                    .atLocation(author)
                    .stretchTo(target)
                    .name(SequencerHelper)
                    .waitUntilFinished(options.powerfulDelay ?? 0)
            
            // Play melee sequence
            await SequencerEffect.play();
            // Check if impact effect should be played
            if (options.powerful == true && game.settings.get(OIF.ID, "powerfulImpactShakeEffect")) {
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
                // Define ranged sequence to be played
                let SequencerHelper = `${options.name}-ranged-${author.data._id}`;
                let SequencerEffect = new Sequence()
                    .effect()
                        .file(options.rangedAnimation)
                        .atLocation(author)
                        .stretchTo(target)
                        .name(SequencerHelper)
                        .missed(options.miss)

                // Play ranged sequence
                await SequencerEffect.play();

                // Get results from played sequence
                let [Effect] = Sequencer.EffectManager.getEffects({ name: SequencerHelper });

                // Create a copy of the ammunition item
                let Ammunition = await author.actor.getEmbeddedDocument("Item", item.data.data.consume.target);

                // Check if Item Pile should be created
                if (options.miss && OIF.SETTINGS.LOADED_MODULES.ITEM_PILES && game.settings.get(OIF.ID, "createItemPilesOnMiss"))
                {
                    // Get the position where the item landed
                    let ItemPilePosition = {
                        x: Effect.targetPosition.x - 50,
                        y: Effect.targetPosition.y - 50
                    }

                    // Drop item
                    ItemDropper.DropAt(Ammunition, 1, ItemPilePosition, target.data.elevation)
                }
                else if (game.settings.get(OIF.ID, "addAmmunitionToTargetInventory"))
                {
                    // Add the ammunition to Target's inventory
                    InventoryManipulator.AddItem(target, Ammunition, 1);
                }
            }
        }
        else 
        {
            // Define ranged sequence to be played
            let SequencerHelper = `${options.name}-ranged-${author.data._id}`;
            let SequencerEffect = new Sequence()
                .effect()
                    .file(options.rangedAnimation)
                    .atLocation(author)
                    .stretchTo(target)
                    .name(SequencerHelper)
                    .missed(options.miss)

            // Play ranged sequence
            await SequencerEffect.play();
        }
    }
}