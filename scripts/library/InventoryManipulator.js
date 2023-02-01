import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";

export class InventoryManipulator
{
    static async RemoveItem(owner, item, quantity)
    {
        // Check if the quantity is exact, if so delete the item from the inventory
        if (item.system.quantity == quantity)
        {
            // Remove the item from the inventory
            await owner.actor.deleteEmbeddedDocuments("Item", [item.id]);
            return true;
        }
        // More than "quantity" units of the item remaining
        else if (item.system.quantity > quantity)
        {
            // Remove "quantity" units from the item
            item.update({ "system.quantity": item.system.quantity - quantity });
            return true;
        }
        // Not enough items to be removed
        else 
        {
            console.error(`Could not remove item! Tried to remove ${quantity} while having only ${item.system.quantity}`)
            return false;
        }
    }

    static async AddItem(target, item, quantity)
    {
        if (quantity < 1) 
        {
            console.error(`Could not add item! ${quantity} is negative and thus invalid`);
            return false;
        }
        else
        {
            let ItemCopy = item.toObject();
            ItemCopy.system.quantity = quantity;
            await target.actor.createEmbeddedDocuments("Item", [ItemCopy]);
            return true;
        }
    }
}