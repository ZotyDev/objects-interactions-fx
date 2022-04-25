import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";

export class ItemDropper
{
    static async DropAt(item, quantity, position, elevation)
    {
        // Check for invalid quantity
        if (quantity < 1) 
        {
            console.error(`Failed to drop item! ${quantity} is negative and thus invalid`);
            return false;
        }

        // Copy the item
        let ItemCopy = item.toObject();
        ItemCopy.data.quantity = quantity;

        // Create a ItemPile and get token reference
        let ItemPileOptions = {
            items: [ItemCopy],
            pileActorName: false
        }
        let ItemPileTokenUuid = await ItemPiles.API.createItemPile(position, ItemPileOptions)
        let ItemPileToken = await fromUuid(ItemPileTokenUuid);

        // Set ItemPile elevation if needed
        if (OIF.SETTINGS.LOADED_MODULES.LEVELS && game.settings.get(OIF.ID, "setElevationOfItemPiles"))
        {
            ItemPileToken.update({
                elevation: elevation ?? 0
            });
        }
    }
}