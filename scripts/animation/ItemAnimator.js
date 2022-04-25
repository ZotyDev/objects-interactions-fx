import { ObjectsInteractionsFX } from "../ObjectsInteractionsFX.js";

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
            if (game.settings.get(ObjectsInteractionsFX.ID, "removeThrowableItem"))
            {
                // Check if this is the last item
                if (item.data.data.quantity == 1) {
                    // Remove the item from the inventory
                    await author.actor.deleteEmbeddedDocuments("Item", [item.id]);
                } 
                // More than 1 unit
                else if (item.data.data.quantity > 1) {
                    // Remove 1 unit of the item
                    item.update({ "data.quantity": item.data.data.quantity - 1 });
                }
                // 0 or less units
                else
                {
                    ui.notifications.error(game.i18n.localize("OIF.Attack.Melee.Error.1"));
                    console.error("Could not find any unit of the item!");
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
            if (options.miss && ObjectsInteractionsFX.SETTINGS.LOADED_MODULES.ITEM_PILES && game.settings.get(ObjectsInteractionsFX.ID, "createItemPilesOnMiss")) {
                // Create array containing the item
                let ItemPileInventoryContainer = [ItemCopy];

                // Get the position where the item landed
                let ItemPilePosition = {
                    x: Effect.targetPosition.x - 50,
                    y: Effect.targetPosition.y - 50
                }

                // Create a ItemPile and get token reference
                let ItemPileOptions = {
                    items: ItemPileInventoryContainer,
                    pileActorName: false
                }
                let ItemPileTokenUuid = await ItemPiles.API.createItemPile(ItemPilePosition, ItemPileOptions);
                let ItemPileToken = await fromUuid(ItemPileTokenUuid);

                // Set ItemPile elevation if needed
                if (ObjectsInteractionsFX.SETTINGS.LOADED_MODULES.LEVELS && game.settings.get(ObjectsInteractionsFX.ID, "setElevationOfItemPiles"))
                {
                    ItemPileToken.update({ elevation: target.data.elevation });
                }
            }
            else if (game.settings.get(ObjectsInteractionsFX.ID, "addThrowableToTargetInventory"))
            {
                // Add the item to Target's inventory
                await target.actor.createEmbeddedDocuments("Item", [ItemCopy]);
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
            if (options.powerful == true && game.settings.get(ObjectsInteractionsFX.ID, "powerfulImpactShakeEffect")) {
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
                let AmmunitionID = item.data.data.consume.target;
                let AmmunitionRef = await author.actor.getEmbeddedDocument("Item", AmmunitionID);
                let Ammunition = JSON.parse(JSON.stringify(AmmunitionRef));
                Ammunition.data.quantity = 1;

                // Check if Item Pile should be created
                if (options.miss && ObjectsInteractionsFX.SETTINGS.LOADED_MODULES.ITEM_PILES && game.settings.get(ObjectsInteractionsFX.ID, "createItemPilesOnMiss"))
                {
                    // Create array containing the item
                    let ItemPileInventoryContainer = [Ammunition];

                    // Get the position where the item landed
                    let ItemPilePosition = {
                        x: Effect.targetPosition.x - 50,
                        y: Effect.targetPosition.y - 50
                    }

                    // Create a ItemPile and get token reference
                    let ItemPileOptions = {
                        items: ItemPileInventoryContainer,
                        pileActorName: false
                    }
                    let ItemPileTokenUuid = await ItemPiles.API.createItemPile(ItemPilePosition, ItemPileOptions);
                    let ItemPileToken = await fromUuid(ItemPileTokenUuid);

                    // Set ItemPile elevation if needed
                    if (ObjectsInteractionsFX.SETTINGS.LOADED_MODULES.LEVELS && game.settings.get(ObjectsInteractionsFX.ID, "setElevationOfItemPiles"))
                    {
                        ItemPileToken.update({ elevation: target.data.elevation });
                    }
                }
                else if (game.settings.get(ObjectsInteractionsFX.ID, "addAmmunitionToTargetInventory"))
                {
                    // Add the ammunition to Target's inventory
                    await target.actor.createEmbeddedDocuments("Item", [Ammunition]);
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