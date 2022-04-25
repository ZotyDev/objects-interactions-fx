import { ObjectsInteractionsFX } from "../ObjectsInteractionsFX.js"

export class ObjectsInteractionsFXData 
{
    static GetData(item)
    {
        return item.getFlag(ObjectsInteractionsFX.ID, ObjectsInteractionsFX.FLAGS.ITEM_TAGS);
    }

    static CheckData(item)
    {
        let ReturnedData = this.GetData(item);
        if (ReturnedData == null || ReturnedData == undefined) 
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    static CreateData(item, tags)
    {
        if (this.CheckData(item)) 
        {
            return null;
        }
        else
        {
            return item.setFlag(ObjectsInteractionsFX.ID, ObjectsInteractionsFX.FLAGS.ITEM_TAGS, tags);
        }
    }

    static UpdateData(item, tags)
    {
        if (this.CheckData(item)) 
        {
            return item.setFlag(ObjectsInteractionsFX.ID, ObjectsInteractionsFX.FLAGS.ITEM_TAGS, tags);
        }
        else
        {
            return this.CreateData(item, tags)
        }
    }

    static DeleteData(item)
    {
        return item.unsetFlag(ObjectsInteractionsFX.ID, ObjectsInteractionsFX.FLAGS.ITEM_TAGS);
    }
}