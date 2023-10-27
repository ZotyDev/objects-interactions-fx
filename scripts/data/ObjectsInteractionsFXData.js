import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js"

export class ObjectsInteractionsFXData
{
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
