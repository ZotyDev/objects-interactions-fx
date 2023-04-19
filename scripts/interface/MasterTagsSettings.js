import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";
import { ObjectsInteractionsFXData as OIFD } from '../data/ObjectsInteractionsFXData.js';
import { MasterTagConfiguration } from "./MasterTagConfiguration.js";
import { SystemSupporter } from "../system/SystemSupporter.js";
import { TagHandler } from "../tags/TagHandler.js";
import { Debug as DBG } from "../library/Debug.js";

export class MasterTagsSettings extends FormApplication {
    static get defaultOptions() {
        const DefaultOptions = super.defaultOptions;

        const OverrideOptions = {
            closeOnSubmit: false,
            height: 'auto',
            width: 600,
            id: 'oif-master-tags-settings',
            submitOnChange: true,
            template: OIF.TEMPLATES.MASTER_TAGS_SETTINGS,
            title: game.i18n.localize('OIF.Settings.MasterTagsSettings.Title'),
        };

        const MergedOptions = foundry.utils.mergeObject(DefaultOptions, OverrideOptions);
        return MergedOptions;
    }

    ////////////////////////////////////////////////////////////
    // Data
    ////////////////////////////////////////////////////////////
    static PackHeaders       = {};
    static CurrentPackHeader = {};
    static Tags              = {};
    static ResultTags        = [];
    static Changed           = false;

    // Interface
    static SearchString      = '';
    static FocusOn           = 'input';

    ////////////////////////////////////////////////////////////
    // Register the settings related to master tags
    ////////////////////////////////////////////////////////////
    static async Register()
    {
        // Prepare the internal foundry setting
        let FoundrySettingOptions = {
            scope  : 'world',
            default: '',
            config : false,
        };

        // Register setting inside foundry
        game.settings.register(OIF.ID, OIF.SETTINGS.MASTER_TAGS.CURRENT_TAG_PACK, FoundrySettingOptions);

        // Assign the default tag pack
        let Setting = await game.settings.get(OIF.ID, OIF.SETTINGS.MASTER_TAGS.CURRENT_TAG_PACK);
        if (Setting == '')
        {
            await game.settings.set(OIF.ID, OIF.SETTINGS.MASTER_TAGS.CURRENT_TAG_PACK, await SystemSupporter.GetDefaultTagPack());
            Setting = await game.settings.get(OIF.ID, OIF.SETTINGS.MASTER_TAGS.CURRENT_TAG_PACK);
        }
    }

    ////////////////////////////////////////////////////////////
    // Load tag pack from object
    ////////////////////////////////////////////////////////////
    static async LoadTagPackFromObject(data)
    {
        // Build the header for the pack
        let PackHeader = 
        {
            id      : data.id,
            name    : data.name,
            default : data.default,
        }

        // Verifies if the required modules are present
        if (data.requires != undefined)
        {
            data.requires.forEach((element) => {
                if (!game.modules.get(element)?.active)
                {
                    // Disable the pack if the required modules are not present
                    // and set the disabled message
                    PackHeader.disabled        = true;
                    PackHeader.disabledMessage = game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.DisabledMessage').replace('${modules}', data.requires);
                    return;
                }
            });
        }

        // Check if the pack is the selected one
        if (await game.settings.get(OIF.ID, OIF.SETTINGS.MASTER_TAGS.CURRENT_TAG_PACK) == data.id)
        {
            PackHeader.selected = true;
            MasterTagsSettings.CurrentPackHeader = PackHeader;
        }

        // Insert the pack into pack list
        MasterTagsSettings.PackHeaders[PackHeader.id] = PackHeader;
    }

    ////////////////////////////////////////////////////////////
    // Load tag pack from file
    ////////////////////////////////////////////////////////////
    static async LoadTagPackFromFile(file)
    {
        // Build the header for the pack
        let PackData = await OIFD.LoadJSON(file);
        let PackHeader = 
        {
            location: file,
            id      : PackData.id,
            name    : PackData.name,
            default : PackData.default,
        }

        // Verifies if the required modules are present
        if (PackData.requires != undefined)
        {
            PackData.requires.forEach((element) => {
                if (!game.modules.get(element)?.active)
                {
                    // Disable the pack if the required modules are not present
                    // and set the disabled message
                    PackHeader.disabled        = true;
                    PackHeader.disabledMessage = game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.DisabledMessage').replace('${modules}', PackData.requires);
                    return;
                }
            });
        }

        // Check if the pack is the selected one
        if (await game.settings.get(OIF.ID, OIF.SETTINGS.MASTER_TAGS.CURRENT_TAG_PACK) == PackData.id)
        {
            PackHeader.selected = true;
            MasterTagsSettings.CurrentPackHeader = PackHeader;
        }

        // Insert the pack into pack list
        MasterTagsSettings.PackHeaders[PackHeader.id] = PackHeader;
    }

    ////////////////////////////////////////////////////////////
    // Load default tag packs
    ////////////////////////////////////////////////////////////
    static async LoadDefaultTagPacks()
    {
        const DefaultTagPacks = 
        [
            'Empty.json',
            'FantasyJB2AComplete.json',
            'FantasyJB2AFree.json',
            'FantasyNoAnimations.json'
        ];

        DefaultTagPacks.forEach(async (path) => 
        {
            await MasterTagsSettings.LoadTagPackFromFile(`modules/${OIF.ID}/data/defaultTagPacks/${path}`);
        });
    }

    ////////////////////////////////////////////////////////////
    // Load tags from a registered pack
    ////////////////////////////////////////////////////////////
    static async LoadTags(pack)
    {
        // Check if the pack exists
        if (MasterTagsSettings.PackHeaders[pack] == undefined)
        {
            ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.Load.Error.NotFound').replace('${pack}', pack));
            pack = "Empty"
            await game.settings.set(OIF.ID, OIF.SETTINGS.MASTER_TAGS.CURRENT_TAG_PACK, pack);
        }

        // Load the tags from the pack
        let Data = {};
        if (MasterTagsSettings.PackHeaders[pack].default)
        {
            // Load the tags from the default pack
            Data = await OIFD.LoadJSON(MasterTagsSettings.PackHeaders[pack].location);
        }
        else
        {
            // Load the tags from the user pack
            const UserPacks = await OIFD.LoadJSON(`${OIF.FILES.DATA_FOLDERS.ROOT}/TagPacks.json`);
            Data = UserPacks[pack];
        }

        MasterTagsSettings.CurrentPackHeader = MasterTagsSettings.PackHeaders[pack];
        MasterTagsSettings.Tags              = Data.tags;
        MasterTagsSettings.ResultTags        = MasterTagsSettings.Tags;

        await game.settings.set(OIF.ID, OIF.SETTINGS.MASTER_TAGS.CURRENT_TAG_PACK, pack);

        // Update the tags at the tag handler
        await TagHandler.UpdateTags(MasterTagsSettings.Tags);

        // Set a flag to indicate that the tags have changed
        MasterTagsSettings.Changed = false;
    }

    ////////////////////////////////////////////////////////////
    // Updates a single tag
    ////////////////////////////////////////////////////////////
    static async UpdateTag(tag, data)
    {
        // Update the tag
        MasterTagsSettings.Tags[tag] = data;
        MasterTagsSettings.ResultTags[tag] = data;

        // Update the tags at the tag handler
        TagHandler.UpdateTags(MasterTagsSettings.Tags);

        // Set a flag to indicate that the tags have changed
        MasterTagsSettings.Changed = true;
    }


    ////////////////////////////////////////////////////////////
    // Save user packs
    ////////////////////////////////////////////////////////////
    static async SaveUserPacks()
    {
        // Put all the packs into a single file
        let Data = {}
        for (const [key, value] of Object.entries(MasterTagsSettings.PackHeaders))
        {
            // Skip the default packs and the current pack
            if (!value.default && value.id != MasterTagsSettings.CurrentPackHeader.id)
            {
                let PackData = await OIFD.GetUserMasterTags(value.id);
                Data[PackData.id] = PackData;
            }
        }

        // Insert the current pack data if it is not a default pack
        if (!MasterTagsSettings.CurrentPackHeader.default)
        {
            let CurrentPackData = 
            {
                ...MasterTagsSettings.CurrentPackHeader,
                tags: MasterTagsSettings.Tags
            }
            CurrentPackData.selected        = undefined;
            CurrentPackData.disabled        = undefined;
            CurrentPackData.disabledMessage = undefined;
            CurrentPackData.location        = undefined;
            Data[MasterTagsSettings.CurrentPackHeader.id] = CurrentPackData;
        }

        MasterTagsSettings.Changed = false;

        // Save the file
        await OIFD.SaveJSON(Data, 'TagPacks.json', OIF.FILES.DATA_FOLDERS.ROOT);

        // Propagate changes
        OIF_SOCKET.executeForOthers('LoadFromConfig');
    }

    ////////////////////////////////////////////////////////////
    // Load user packs
    ////////////////////////////////////////////////////////////
    static async LoadUserPacks()
    {
        // Load the file
        let Data = await OIFD.LoadJSON(`${OIF.FILES.DATA_FOLDERS.ROOT}/TagPacks.json`);

        // Iterate through all packs
        for (const [key, value] of Object.entries(Data))
        {
            let PackHeader =
            {
                id  : value.id,
                name: value.name,
                selected: value.id == await game.settings.get(OIF.ID, OIF.SETTINGS.MASTER_TAGS.CURRENT_TAG_PACK) ? true : undefined,
            }

            MasterTagsSettings.PackHeaders[value.id] = PackHeader;
        }
    }

    ////////////////////////////////////////////////////////////
    // Load everything
    static async LoadFromConfig()
    {
        // Load default packs
        await MasterTagsSettings.LoadDefaultTagPacks();
        // Load user packs
        await MasterTagsSettings.LoadUserPacks();
        // Get the current tag pack
        let CurrentTagPack = await game.settings.get(OIF.ID, OIF.SETTINGS.MASTER_TAGS.CURRENT_TAG_PACK);
        // Is the pack disabled?
        if (MasterTagsSettings.PackHeaders[CurrentTagPack]?.disabled)
        {
            // Reset to default
            MasterTagsSettings.PackHeaders[CurrentTagPack].selected = false;
            CurrentTagPack = 'Emtpy';
        }

        // Load the tags
        await MasterTagsSettings.LoadTags(CurrentTagPack);

        DBG.Log('Loaded tags from config', MasterTagsSettings.Tags);
    }

    ////////////////////////////////////////////////////////////
    // Internal function that filters the tags
    ////////////////////////////////////////////////////////////
    static async _filterTags()
    {
        let FilteredTags = Object.keys(MasterTagsSettings.Tags)
            .filter((key) => key == MasterTagsSettings.SearchString || key.toLowerCase().includes(MasterTagsSettings.SearchString.toLowerCase()))
            .reduce((obj, key) => {
                return Object.assign(obj, {
                    [key]: MasterTagsSettings.Tags[key]
                });
            }, {});

        return FilteredTags;
    }

    ////////////////////////////////////////////////////////////
    // Internal function that creates a new pack
    ////////////////////////////////////////////////////////////
    async _createNewPack(id, name, tags)
    {
        // Current pack is no longer selected
        MasterTagsSettings.CurrentPackHeader.selected = false;
        MasterTagsSettings.PackHeaders[MasterTagsSettings.CurrentPackHeader.id].selected = false;

        // Create the new pack
        let NewTagPackHeader = {
            id      : id,
            name    : name,
            selected: true
        };

        // Add the pack to the list
        MasterTagsSettings.PackHeaders[id] = NewTagPackHeader;
        MasterTagsSettings.CurrentPackHeader = NewTagPackHeader;
        MasterTagsSettings.Tags = tags;

        // Update the tags at the tag handler
        TagHandler.UpdateTags(MasterTagsSettings.Tags);

        // Set the new pack as the current pac
        await game.settings.set(OIF.ID, OIF.SETTINGS.MASTER_TAGS.CURRENT_TAG_PACK, id);

        MasterTagsSettings.Changed = true;

        this.render();
    }

    ////////////////////////////////////////////////////////////
    // Handle pack selection
    ////////////////////////////////////////////////////////////
    async _handlePackSelection(event)
    {
        let ClickedElement = $(event.currentTarget)[0];
        Object.values(MasterTagsSettings.PackHeaders).forEach((element) => 
        {
            element.selected = element.id == ClickedElement.value ? true : false;
        });
        await MasterTagsSettings.LoadTags(ClickedElement.value);

        // Propagate changes
        OIF_SOCKET.executeForOthers('LoadFromConfig');

        this.render();
    }

    ////////////////////////////////////////////////////////////
    // Load user packs
    ////////////////////////////////////////////////////////////
    async _handleTagSearching(event)
    {
        if (event.key == 'Enter')
        {
            MasterTagsSettings.SearchString = event.target.value;
            if (MasterTagsSettings.SearchString != '')
            {
                MasterTagsSettings.ResultTags = await MasterTagsSettings._filterTags();
            }
            else
            {
                MasterTagsSettings.ResultTags = MasterTagsSettings.Tags;
            }
            MasterTagsSettings.FocusOn = 'search';
            this.render();
        }
    }

    ////////////////////////////////////////////////////////////
    // Handle tag creation
    ////////////////////////////////////////////////////////////
    async _handleTagCreation(event)
    {
        if (event.key == 'Enter')
        {
            let CurrentTag = event.target.value;
            if (MasterTagsSettings.Tags[CurrentTag] == undefined || MasterTagsSettings.Tags[CurrentTag] == null)
            {
                MasterTagsSettings.Tags[CurrentTag] = {
                     enabled: false,
                     masterDeco: true
                    };
                MasterTagsSettings.ResultTags = await MasterTagsSettings._filterTags();
                TagHandler.UpdateTags(MasterTagsSettings.Tags);
            }
            else
            {
                ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.Creation.Error.Duplicated'))
            }
            MasterTagsSettings.FocusOn = 'input';
            MasterTagsSettings.Changed = true;
            this.render();
        }
    }

    ////////////////////////////////////////////////////////////
    // Handle tag configuration
    ////////////////////////////////////////////////////////////
    async _handleTagConfiguration(event)
    {
        let CurrentTagName = event.target.parentElement.parentElement.id;
        let CurrentTag = MasterTagsSettings.Tags[CurrentTagName];
        let ConfigurationInterface = new MasterTagConfiguration;
        ConfigurationInterface.render(true, 
            { 
                configurationData: CurrentTag,
                caller: this,
                dataNameAtSingleton: CurrentTagName
            });
        this.render();
    }

    ////////////////////////////////////////////////////////////
    // Handle tag deletion
    ////////////////////////////////////////////////////////////
    async _handleTagDeletion(event)
    {
        let CurrentTag = event.target.parentElement.parentElement.id;
        let ConfirmDialog = Dialog.confirm({
            title: game.i18n.localize('OIF.Settings.MasterTagsSettings.Deletion.Title').replace('${tag}', CurrentTag),
            content: `<p style="color:red">${game.i18n.localize('OIF.Settings.MasterTagsSettings.Deletion.Description')}</p`,
            no: async () => 
            {
                this.render();
            },
            yes: async () => 
            {
                delete MasterTagsSettings.Tags[CurrentTag];
                MasterTagsSettings.ResultTags = await MasterTagsSettings._filterTags();
                TagHandler.UpdateTags(MasterTagsSettings.Tags);
                MasterTagsSettings.Changed = true;
                this.render();
            },
            defaultYes: false
        });
    }

    ////////////////////////////////////////////////////////////
    // Handle tag pack deletion
    ////////////////////////////////////////////////////////////
    async _handleTagPackDeletion(event)
    {
        let ConfirmDialog = Dialog.confirm({
            title: game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.Delete.Title').replace('${pack}', MasterTagsSettings.CurrentPackHeader.name),
            content: `<p style="color:red">${game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.Delete.Description')}</p`,
            no: async () => 
            {
                this.render();
            },
            yes: async () => 
            {
                delete MasterTagsSettings.PackHeaders[MasterTagsSettings.CurrentPackHeader.id];
                await MasterTagsSettings.LoadTags("Empty");
                await MasterTagsSettings.SaveUserPacks();
                this.render();
            },
            defaultYes: false
        });
    }

    ////////////////////////////////////////////////////////////
    // Handle tag pack rename
    ////////////////////////////////////////////////////////////
    async _handleTagPackRenaming(event)
    {
        let NewPackDialog = new Dialog({
            title: game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.Rename.Title'),
            content: `
                    <label for="oif-pack-new-id">${game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.Rename.Id')}</label> 
                    <input type="text" id="oif-pack-new-id" name="oif-pack-new-id" value="${MasterTagsSettings.CurrentPackHeader.id}">
                    <label for="oif-pack-new-name">${game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.Rename.Name')}</label> 
                    <input type="text" id="oif-pack-new-name" name="oif-pack-new-name" value="${MasterTagsSettings.CurrentPackHeader.name}">
                    `,
            buttons: {
                rename: {
                    icon: '<i class="fas fa-pen"></i>',
                    label: game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.Rename.Label'),
                    callback: async (html) => {
                        let NewPackID = html.find('#oif-pack-new-id').val();
                        let NewPackName = html.find('#oif-pack-new-name').val();

                        if (NewPackID == '' || NewPackName == '')
                        {
                            ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.Rename.Error.EmptyValues'));
                        }
                        else if (NewPackID != MasterTagsSettings.CurrentPackHeader.id || NewPackName != MasterTagsSettings.CurrentPackHeader.name)
                        {
                            let DoesNameCollide = false;
                            Object.values(MasterTagsSettings.PackHeaders).every((element) => {
                                if (element.name == NewPackName)
                                {
                                    DoesNameCollide = true;
                                    return false;
                                }
                                return true;
                            })
                            if (MasterTagsSettings.PackHeaders[NewPackID] != undefined && DoesNameCollide)
                            {
                                ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.Rename.Error.BothAlreadyExist'));
                            }
                            else if (MasterTagsSettings.PackHeaders[NewPackID] != undefined)
                            {
                                ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.Rename.Error.IDAlreadyExist'));
                            }
                            else if (DoesNameCollide)
                            {
                                ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.Rename.Error.NameAlreadyExist'));
                            }
                            else
                            {
                                // Rename the pack
                                this.render();
                            } 
                        }
                    }
                }
            }
        });
        NewPackDialog.render(true);
    }

    ////////////////////////////////////////////////////////////
    // Handle tag pack export
    ////////////////////////////////////////////////////////////
    async _handleTagPackExport(event)
    {
        let CurrentPackData = 
        {
            ...MasterTagsSettings.CurrentPackHeader,
            tags: MasterTagsSettings.Tags
        }
        CurrentPackData.selected        = undefined;
        CurrentPackData.disabled        = undefined;
        CurrentPackData.disabledMessage = undefined;
        CurrentPackData.location        = undefined;
        saveDataToFile(JSON.stringify(CurrentPackData), 'application/json', `${MasterTagsSettings.CurrentPackHeader.name}.tagpack`);
    }

    ////////////////////////////////////////////////////////////
    // Handle tag pack import
    ////////////////////////////////////////////////////////////
    async _handleTagPackImport(event)
    {
        // Create a file input element
        const inputElement = document.createElement('input');
        inputElement.type = 'file';
        // Listen for the file to be selected
        inputElement.addEventListener('change', async (event) => 
        {
            // Read the file
            const selectedFile = event.target.files[0];
            readTextFromFile(selectedFile).then(async (json) => 
            {
                // Insert the file header into the pack headers
                let Data = JSON.parse(json);

                // Check if the pack already exists
                let DuplicatedID = false;
                let DuplicatedName = false;
                let ShouldImport = false;
                if (MasterTagsSettings.PackHeaders[Data.id] != undefined)
                {
                    DuplicatedID = true;   
                }

                // Check if there is a pack with the same name
                for (let PackId in MasterTagsSettings.PackHeaders)
                {
                    if (MasterTagsSettings.PackHeaders[PackId].name == Data.name)
                    {
                        DuplicatedName = true;
                    }
                }

                // Pack already exists
                if (DuplicatedID && DuplicatedName)
                {
                    // Ask the user if he wants to overwrite the pack
                    let ConfirmDialog = await Dialog.confirm({
                        title: game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.Import.Duplicated.Title'),
                        content: `<p style="color:red">${game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.Import.Duplicated.Description').replace('${pack}', Data.name)}</p`,
                        no: () => 
                        {
                            ShouldImport = false;
                        },
                        yes: () => 
                        {
                            ShouldImport = true;
                        },
                        defaultYes: false
                    });
                }
                // Duplicated ID
                else if (DuplicatedID)
                {
                    ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.Import.Error.DuplicatedID'));
                    return;
                }
                // Duplicated name
                else if (DuplicatedName)
                {
                    ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.Pack.Import.Error.DuplicatedName'));
                    return;
                }

                // Import the pack
                if (ShouldImport)
                {
                    await MasterTagsSettings.LoadTagPackFromObject(JSON.parse(json));

                    // Unselects the current pack
                    MasterTagsSettings.CurrentPackHeader.selected = undefined;
                    MasterTagsSettings.PackHeaders[MasterTagsSettings.CurrentPackHeader.id].selected = undefined;
                    
                    // Set the imported pack as the current pack
                    MasterTagsSettings.CurrentPackHeader = MasterTagsSettings.PackHeaders[Data.id];
                    MasterTagsSettings.CurrentPackHeader.selected = true;
                    MasterTagsSettings.PackHeaders[Data.id].selected = true;

                    // Load the tags from the imported pack
                    MasterTagsSettings.Tags = Data.tags;
                    MasterTagsSettings.ResultTags = await MasterTagsSettings._filterTags();
                    TagHandler.UpdateTags(MasterTagsSettings.Tags);

                    // Save the pack headers
                    await MasterTagsSettings.SaveUserPacks();
                }

                this.render();
            });
        });
        inputElement.click();
    }

    ////////////////////////////////////////////////////////////
    // Handle tag pack copy
    ////////////////////////////////////////////////////////////
    async _handleTagPackCopy(event)
    {
        let NewPackDialog = new Dialog({
            title: game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Title'),
            content: `
                    <br>
                    <label for="oif-pack-new-id">${game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Id')}</label> 
                    <input type="text" id="oif-pack-new-id" name="oif-pack-new-id">
                    <label for="oif-pack-new-name">${game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Name')}</label> 
                    <input type="text" id="oif-pack-new-name" name="oif-pack-new-name">
                    `,
            buttons: {
                create: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Copy').replace('${pack}', MasterTagsSettings.CurrentPackHeader.name),
                    callback: async (html) => {
                        let NewPackID = html.find('#oif-pack-new-id').val();
                        let NewPackName = html.find('#oif-pack-new-name').val();

                        if (NewPackID == '' || NewPackName == '')
                        {
                            ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Error.EmptyValues'));
                        }
                        else
                        {
                            let DoesNameCollide = false;
                            Object.values(MasterTagsSettings.PackHeaders).every((element) => {
                                if (element.name == NewPackName)
                                {
                                    DoesNameCollide = true;
                                    return false;
                                }
                                return true;
                            })
                            if (MasterTagsSettings.PackHeaders[NewPackID] != undefined && DoesNameCollide)
                            {
                                ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Error.BothAlreadyExist'));
                            }
                            else if (MasterTagsSettings.PackHeaders[NewPackID] != undefined)
                            {
                                ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Error.IDAlreadyExist'));
                            }
                            else if (DoesNameCollide)
                            {
                                ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Error.NameAlreadyExist'));
                            }
                            else
                            {
                                await this._createNewPack(NewPackID, NewPackName, MasterTagsSettings.Tags);
                                await MasterTagsSettings.SaveUserPacks();
                                this.render();
                            } 
                        }
                    }
                }
            },
            default: 'create'
        });
        NewPackDialog.render(true);
    }

    async _handleTagPackCreate(event)
    {
        let NewPackDialog = new Dialog({
            title: game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Title'),
            content: `
                    <p>${game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Description')}</p> 
                    <label for="oif-pack-new-id">${game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Id')}</label> 
                    <input type="text" id="oif-pack-new-id" name="oif-pack-new-id">
                    <label for="oif-pack-new-name">${game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Name')}</label> 
                    <input type="text" id="oif-pack-new-name" name="oif-pack-new-name">
                    <br>
                    `,
            buttons: {
                create: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Create'),
                    callback: async (html) => {
                        let NewPackID = html.find('#oif-pack-new-id').val();
                        let NewPackName = html.find('#oif-pack-new-name').val();

                        if (NewPackID == '' || NewPackName == '')
                        {
                            ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Error.EmptyValues'));
                        }
                        else
                        {
                            let DoesNameCollide = false;
                            Object.values(MasterTagsSettings.PackHeaders).every((element) => {
                                if (element.name == NewPackName)
                                {
                                    DoesNameCollide = true;
                                    return false;
                                }
                                return true;
                            })
                            if (MasterTagsSettings.PackHeaders[NewPackID] != undefined && DoesNameCollide)
                            {
                                ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Error.BothAlreadyExist').replace('${pack}', MasterTagsSettings.CurrentPackHeader.name).replace('${id}', MasterTagsSettings.CurrentPackHeader.id));
                            }
                            else if (MasterTagsSettings.PackHeaders[NewPackID] != undefined)
                            {
                                ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Error.IDAlreadyExist').replace('${id}', MasterTagsSettings.CurrentPackHeader.id));
                            }
                            else if (DoesNameCollide)
                            {
                                ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Error.NameAlreadyExist').replace('${pack}', MasterTagsSettings.CurrentPackHeader.name));
                            }
                            else
                            {
                                await MasterTagsSettings.LoadTags('Empty');
                                await this._createNewPack(NewPackID, NewPackName, MasterTagsSettings.Tags);
                                await MasterTagsSettings.SaveUserPacks();
                                this.render();
                            } 
                        }
                    }
                }
            },
            default: 'create'
        });
        NewPackDialog.render(true);
    }

    async _handleTagPackDiscardChanges()
    {
        let ConfirmDialog = Dialog.confirm({
            title: game.i18n.localize('OIF.Settings.MasterTagsSettings.Discard.Title'),
            content: `<p style="color:red">${game.i18n.localize('OIF.Settings.MasterTagsSettings.Discard.Description')}</p`,
            no: async () => 
            {
                this.render();
            },
            yes: async () => 
            {
                await MasterTagsSettings.LoadTags(MasterTagsSettings.CurrentPackHeader.id);
                this.render();
            },
            defaultYes: false
        });
    }

    async _handleTagPackSaveChanges(event)
    {
        if (!MasterTagsSettings.Changed)
        {
            return;
        }
        
        if (MasterTagsSettings.CurrentPackHeader.default)
        {
            let NewPackDialog = new Dialog({
                title: game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPackCopy.Title'),
                content: `
                        <p>${game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPackCopy.Description')}</p> 
                        <br>
                        <label for="oif-pack-new-id">${game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPackCopy.Id')}</label> 
                        <input type="text" id="oif-pack-new-id" name="oif-pack-new-id">
                        <label for="oif-pack-new-name">${game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPackCopy.Name')}</label> 
                        <input type="text" id="oif-pack-new-name" name="oif-pack-new-name">
                        <br>
                        `,
                buttons: {
                    create: {
                        icon: '<i class="fas fa-check"></i>',
                        label: game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPackCopy.Copy').replace('${pack}', MasterTagsSettings.CurrentPackHeader.name),
                        callback: async (html) => {
                            let NewPackID = html.find('#oif-pack-new-id').val();
                            let NewPackName = html.find('#oif-pack-new-name').val();

                            if (NewPackID == '' || NewPackName == '')
                            {
                                ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPackCopy.Error.EmptyValues'));
                            }
                            else
                            {
                                let DoesNameCollide = false;
                                Object.values(MasterTagsSettings.PackHeaders).every((element) => {
                                    if (element.name == NewPackName)
                                    {
                                        DoesNameCollide = true;
                                        return false;
                                    }
                                    return true;
                                })
                                if (MasterTagsSettings.PackHeaders[NewPackID] != undefined && DoesNameCollide)
                                {
                                    ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Error.BothAlreadyExist').replace('${pack}', MasterTagsSettings.CurrentPackHeader.name).replace('${id}', MasterTagsSettings.CurrentPackHeader.id));
                                }
                                else if (MasterTagsSettings.PackHeaders[NewPackID] != undefined)
                                {
                                    ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Error.IDAlreadyExist').replace('${id}', MasterTagsSettings.CurrentPackHeader.id));
                                }
                                else if (DoesNameCollide)
                                {
                                    ui.notifications.error(game.i18n.localize('OIF.Settings.MasterTagsSettings.NewPack.Error.NameAlreadyExist').replace('${pack}', MasterTagsSettings.CurrentPackHeader.name));
                                }
                                else
                                {
                                    await this._createNewPack(NewPackID, NewPackName, MasterTagsSettings.Tags);
                                    await MasterTagsSettings.SaveUserPacks();
                                    this.render();
                                } 
                            }
                        }
                    }
                },
                default: 'create'
            });
            NewPackDialog.render(true);
        }
        else
        {
            await MasterTagsSettings.SaveUserPacks();
            this.render();
        }
    }

    activateListeners(html) 
    {
        super.activateListeners(html);

        // Tags
        html.on('change'  , 'select'                                , this._handlePackSelection.bind(this));
        html.on('keypress', 'input[class="oif-tag-input"]'          , this._handleTagCreation.bind(this));
        html.on('keypress', 'input[class="oif-tag-search"]'         , this._handleTagSearching.bind(this));
        html.on('click'   , 'i[class="fas fa-wrench"]'              , this._handleTagConfiguration.bind(this));
        html.on('click'   , 'i[class="fas fa-times"]'               , this._handleTagDeletion.bind(this));

        // Tag Packs
        html.on('click', 'button[id="oif-delete-tag-pack"]'         , this._handleTagPackDeletion.bind(this));
        html.on('click', 'button[id="oif-rename-tag-pack"]'         , this._handleTagPackRenaming.bind(this));
        html.on('click', 'button[id="oif-export-tag-pack"]'         , this._handleTagPackExport.bind(this));
        html.on('click', 'button[id="oif-import-tag-pack"]'         , this._handleTagPackImport.bind(this));
        html.on('click', 'button[id="oif-copy-tag-pack"]'           , this._handleTagPackCopy.bind(this));
        html.on('click', 'button[id="oif-create-tag-pack"]'         , this._handleTagPackCreate.bind(this));

        html.on('click', 'button[id="oif-tag-pack-discard-changes"]', this._handleTagPackDiscardChanges.bind(this));
        html.on('click', 'button[id="oif-tag-pack-save-changes"]'   , this._handleTagPackSaveChanges.bind(this));

        let SelectedElement;
        switch (MasterTagsSettings.FocusOn)
        {
            case 'input' : SelectedElement = html[0].querySelector('input[class="oif-tag-input"]'); break;
            case 'search': SelectedElement = html[0].querySelector('input[class="oif-tag-search"]'); break;
            default: break;
        }

        let CursorEnd = SelectedElement.value.length ?? 0;
        SelectedElement?.setSelectionRange(CursorEnd, CursorEnd);
        SelectedElement?.focus();
    }

    getData(options)
    {
        return {
            packs: MasterTagsSettings.PackHeaders,
            currentPack: MasterTagsSettings.CurrentPackHeader,
            search: MasterTagsSettings.SearchString != '' ? MasterTagsSettings.SearchString : undefined,
            tags: MasterTagsSettings.ResultTags,
            canSave: MasterTagsSettings.Changed,
        }
    }

    async _updateObject(event, formData) 
    {
    }
}