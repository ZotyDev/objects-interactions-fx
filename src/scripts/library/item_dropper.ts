// @ts-nocheck
import { GeneralSettings } from "../interface/general_settings";
import { ObjectsInteractionsFX as OIF } from "../objects_interactions_fx";

import { Constants as C } from "../constants";

export class ItemDropper {
  static async dropAt(item, quantity, position, elevation) {
    // Debug
    C.D.info('ItemDropper.dropAt()');

    // Check for invalid quantity
    if (quantity < 1) {
      // Debug
      C.D.error(`Failed to drop item! ${quantity} is negative and thus invalid`);

      return false;
    }

    // Copy the item
    let itemCopy = await structuredClone(item);
    await Bifrost.setItemInformation(itemCopy, {
      physical: {
        quantity: quantity ,
      }
    });

    // Create a ItemPile and get token reference
    let itemPileOptions = {
      items: itemCopy,
      pileActorName: false,
      position: position,
      tokenOverrides: {}
    }

    // Minify the name of dropped items
    if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.MINIFY_ITEM_PILES_NAMES)) {
      itemPileOptions.tokenOverrides.name = '▲';
    }
    else {
      itemPileOptions.tokenOverrides.name = itemCopy.name;
    }

    // Check if ItemPile should snap to grid
    if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.SNAP_CREATED_ITEM_PILES_TO_GRID)) {
      itemPileOptions.position = canvas.grid.getSnappedPosition(itemPileOptions.position.x, itemPileOptions.position.y);
    }

    const ItemPileTokenUuid = await game.itempiles.API.createItemPile(itemPileOptions);
    let ItemPileToken = await fromUuid(ItemPileTokenUuid.tokenUuid);

    // ! CURRENTLY DEPRECATED
    // Set ItemPile elevation if needed
    // if (OIF.OPTIONAL_MODULES.LEVELS.active && GeneralSettings.Get(OIF.SETTINGS.GENERAL.//SET_ELEVATION_OF_ITEM_PILES)) {
    //     ItemPileToken.update({
    //         elevation: elevation ?? 0
    //     });
    // }
    //
    // Add a tag to the ItemPile to indicate it was created by OIF
    // if (OIF.OPTIONAL_MODULES.TAGGER.active) {
    //     Tagger.addTags(ItemPileToken, [`${OIF.ID}-dropped-item-${item.id}`]);
    // }
  }
}
