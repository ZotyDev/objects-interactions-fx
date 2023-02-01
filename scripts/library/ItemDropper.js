import { GeneralSettings } from "../interface/GeneralSettings.js";
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
        ItemCopy.system.quantity = quantity;

        // Create a ItemPile and get token reference
        let ItemPileOptions = {
            items: [ItemCopy],
            pileActorName: false,
            position: position
        }
        
        let ItemPileTokenUuid = await game.itempiles.API.createItemPile(ItemPileOptions);
        let ItemPileToken = await fromUuid(ItemPileTokenUuid.tokenUuid);

        // Minify the name of dropped items
        if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.MINIFY_ITEM_PILES_NAMES))
        {
            ItemPileToken.update({ "name": "▲" });
        }

        // Set ItemPile elevation if needed
        if (OIF.OPTIONAL_MODULES.LEVELS.active && GeneralSettings.Get(OIF.SETTINGS.GENERAL.SET_ELEVATION_OF_ITEM_PILES))
        {
            ItemPileToken.update({
                elevation: elevation ?? 0
            });
        }
    }
}