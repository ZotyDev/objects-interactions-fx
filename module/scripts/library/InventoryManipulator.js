////////////////////////////////////////////////////////////////////////////////
//                          ███████    █████ ███████████                      //
//                        ███░░░░░███ ░░███ ░░███░░░░░░█                      //
//                       ███     ░░███ ░███  ░███   █ ░                       //
//                      ░███      ░███ ░███  ░███████                         //
//                      ░███      ░███ ░███  ░███░░░█                         //
//                      ░░███     ███  ░███  ░███  ░                          //
//                       ░░░███████░   █████ █████                            //
//                         ░░░░░░░    ░░░░░ ░░░░░                             //
//        Automated Objects, Interactions and Effects -  By ZotyDev           //
////////////////////////////////////////////////////////////////////////////////
import { Constants as C } from "../constants.js";
export class InventoryManipulator {
  ////////////////////////////////////////////////////////////////////////////
  // Removes an item from the owner's inventory
  // ? This method remove based on a valid quantity, if the quantity is exact
  // ? the item gets deleted.
  ////////////////////////////////////////////////////////////////////////////
  static async removeItem(owner, item, quantity){
    // Debug
    C.D.info('InventoryManipulator.removeItem()');

    const itemInformation = Bifrost.getItemInformation(item);

    // Check if the quantity is exact, if so delete the item from the inventory
    if (itemInformation.physical.quantity == quantity) {
      // Debug
      C.D.info('The entire quantity got removed, deleting item...');

      // Remove the item from the inventory
      await Bifrost.deleteItems(owner, [item.id]);
      return true;
    }
    else if (itemInformation.physical.quantity > quantity) {
      // Debug
      C.D.info(`Subtracting the removed quantity: ${itemInformation.physical.quantity} - ${quantity}...`);

      // Remove "quantity" units from the item
      await Bifrost.setItemInformation(item, {
        physical: {
          quantity: itemInformation.physical.quantity - quantity,
        }
      });

      return true;
    }
    // Not enough items to be removed
    else {
      // Debug
      C.D.error(`Could not remove item! Tried to remove ${quantity} while having only ${itemInformation.physical.quantity}`);

      return false;
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // Adds an item to the target's inventory
  ////////////////////////////////////////////////////////////////////////////
  static async addItem(target, item, quantity) {
    // Debug
    C.D.info('InventoryManipulator.addItem()');

    if (quantity < 1) {
      // Debug
      C.D.error(`Could not add item! ${quantity} is negative and thus invalid`);

      return false;
    }
    else {
      let itemCopy = structuredClone(item);
      await Bifrost.setItemInformation(itemCopy, {
        physical: {
          quantity: quantity,
        }
      });
      await Bifrost.createItems(target, [itemCopy]);
      return true;
    }
  }
}
