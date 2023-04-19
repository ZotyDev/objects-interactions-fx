import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js"

export class ObjectsInteractionsFXData 
{
    static GetData(item)
    {
        if (!this.CheckData(item)) 
        {
            return this.CreateData(item);   
        }
        else
        {
            return this._Migrate(item.getFlag(OIF.ID, OIF.FLAGS.ITEM_TAGS));
        }
    }

    static CheckData(item)
    {
        let ReturnedData = item.getFlag(OIF.ID, OIF.FLAGS.ITEM_TAGS);
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
        if (tags != null && tags != undefined) 
        {
            tags = [tags];
        }
        else
        {
            tags = [];
        }

        if (this.CheckData(item)) 
        {
            return null;
        }
        else
        {
            return item.setFlag(OIF.ID, OIF.FLAGS.ITEM_TAGS, tags);
        }
    }

    static UpdateData(item, tags)
    {
        if (this.CheckData(item)) 
        {
            return item.setFlag(OIF.ID, OIF.FLAGS.ITEM_TAGS, tags);
        }
        else
        {
            return this.CreateData(item, tags)
        }
    }

    static DeleteData(item)
    {
        return item.unsetFlag(OIF.ID, OIF.FLAGS.ITEM_TAGS);
    }

    static _Migrate(text)
    {
        if (!Array.isArray(text)) 
        {
            return [text];
        }
        else
        {
            return text;
        }
    }

    
    static async SaveMasterTags(data, name, path)
    {
        const NewFile = new File([JSON.stringify(data)], name, { type: 'application/json' });
        await FilePicker.upload(OIF.FILES.ORIGIN, path, NewFile, {});
    }

    static async LoadJSON(path)
    {
        return await foundry.utils.fetchJsonWithTimeout(path);
    }
    
    static async SaveJSON(data, name, path)
    {
        const NewFile = new File([JSON.stringify(data)], name, { type: 'application/json' });
        await FilePicker.upload(OIF.FILES.ORIGIN, path, NewFile, {});
    }

    static async GetUserMasterTags(pack)
    {
        let UserPacks = await ObjectsInteractionsFXData.LoadJSON(`${OIF.FILES.DATA_FOLDERS.ROOT}/TagPacks.json`);
        return UserPacks[pack];
    }
}