import { ItemAnimator } from "./animation/ItemAnimator.js";
import { ObjectsInteractionsFX as OIF } from "./ObjectsInteractionsFX.js";
import { Settings } from "./Settings.js";
import { ItemTags } from "./interface/ItemTags.js";
import { SystemHelper } from "./system/SystemHelper.js";
import { MasterTagsSettings } from "./interface/MasterTagsSettings.js";
import { GeneralSettings } from "./interface/GeneralSettings.js";
import { ObjectsInteractionsFXData } from "./data/ObjectsInteractionsFXData.js";
import { TagHandler } from "./tags/TagHandler.js";
import { TokenLightingManipulator } from "./library/TokenLightingManipulator.js";

Hooks.on("init", () =>
{
    console.log("%cObject Interaction FX", `
        color:#FF0088;
        background-color:white;
        font-size:25pt;
        font-weight:bold;
        padding:15pt;
    `);

    OIF.Initialize();

    Hooks.on("getItemSheetHeaderButtons", async (itemSheet, buttonArray) => {
        let TagButton = {
            label: "Tags",
            class: "item-tags",
            icon: "fas fa-tags",
            onclick: async () => {
                new ItemTags().render(true, { item: itemSheet.object, width: 480 })
            }
        }

        buttonArray.unshift(TagButton);
    });

    Hooks.on('getSceneControlButtons', (controls) => {
        if (!canvas.scene) return;

        const MasterTags = {
            name: 'master-tags',
            title: game.i18n.localize('OIF.Tooltips.MasterTags.Title'),
            icon: 'fas fa-tags',
            onClick: async () => {
                new MasterTagsSettings().render(true);
            },
            button: true
        }

        const ClearLighting = {
            name: 'clear-lighting',
            title: game.i18n.localize('OIF.Tooltips.ClearLighting.Title'),
            icon: 'fas fa-lightbulb-slash',
            onClick: async () => {
                TokenLightingManipulator.RemoveAllLighting();
            },
            button: true
        }

        controls.push({
            name: OIF.ID,
            title: OIF.NAME,
            layer: 'CanvasEffects',
            icon: 'fas fa-snowflake',
            visible: game.user.isGM,
            tools: [
                MasterTags,
                ClearLighting
            ]
        });
    })

    Hooks.on("getActorSheetHeaderButtons", async (itemSheet, buttonArray) => {
        let TagButton = {
            label: "Tags",
            class: "item-tags",
            icon: "fas fa-tags",
            onclick: async () => {
                new ItemTags().render(true, { item: itemSheet.object, width: 480 })
            }
        }

        buttonArray.unshift(TagButton);
    })

    window[OIF.FLAGS.OIF] = {
        MeleeWeaponSingleAttack: ItemAnimator.MeleeWeaponSingleAttack,
        RangedSingleAttack: ItemAnimator.RangedWeaponSingleAttack,
        
        LoadTagPackFromFile: MasterTagsSettings.LoadTagPackFromFile,
        LoadTagPacksFromFolder: MasterTagsSettings.LoadTagPacksFromFolder,
    };

    Hooks.on("ready", async () => {
        await Settings.Initialize();

        let test = await game.settings.get(OIF.ID, OIF.SETTINGS.MASTER_TAGS.CURRENT_TAG_PACK);
        // Create the folders that are going to be used
        if (game.user.isGM)
        {
            // Create the root folder if it doesn't exist
            let Folders = await FilePicker.browse(OIF.FILES.ORIGIN, '.');
            if (!Folders.dirs.includes(OIF.FILES.DATA_FOLDERS.ROOT))
            {
                console.warn("Root folder doesn't exist, creating it...");
                await FilePicker.createDirectory(OIF.FILES.ORIGIN, OIF.FILES.DATA_FOLDERS.ROOT);
            }

            // Create the default tag packs file if it doesn't exist
            Folders = await FilePicker.browse(OIF.FILES.ORIGIN, OIF.FILES.DATA_FOLDERS.ROOT);
            if (!Folders.files.includes(`${OIF.FILES.DATA_FOLDERS.ROOT}/TagPacks.json`))
            {
                console.warn("TagPacks.json doesn't exist, creating it...");
                let Data = {};
                await ObjectsInteractionsFXData.SaveJSON(Data, 'TagPacks.json', OIF.FILES.DATA_FOLDERS.ROOT);
            }

            // Load default packs
            await MasterTagsSettings.LoadTagPacksFromFolder(OIF.FILES.DATA_FOLDERS.DEFAULT_TAG_PACKS);
            await MasterTagsSettings.LoadUserPacks();
            let CurrentTagPack = await game.settings.get(OIF.ID, OIF.SETTINGS.MASTER_TAGS.CURRENT_TAG_PACK);
            if (MasterTagsSettings.PackHeaders[CurrentTagPack]?.disabled)
            {
                MasterTagsSettings.PackHeaders[CurrentTagPack].selected = false;
                CurrentTagPack = "Empty";
            }
            await MasterTagsSettings.LoadTags(CurrentTagPack);

            ////////////////////////////////////////////////////////////
            // Item Roll Attacher
            ////////////////////////////////////////////////////////////
            Hooks.on(GeneralSettings.Get(OIF.SETTINGS.GENERAL.DEFAULT_ATTACK_HOOK), async (workflow) => 
            {
                // Retrieve the item
                let Item = workflow.item;

                // Get the tags of the item
                let Tags = await ObjectsInteractionsFXData.GetData(Item);

                // Check if there are tags to be used
                if (Tags.length > 0)
                {
                    // Set the options
                    let Options = {
                        name: Tags[0],
                        item: Item,
                        tags: Tags,
                        author: await canvas.tokens.get(workflow.tokenId),
                        targets: Array.from(game.user.targets),
                        miss: workflow.hitTargets.size === 0 ?? false,
                    }
                    
                    // Send tags to the handler
                    TagHandler.Dispatch(Options);
                }
            })
        }

        Hooks.callAll("oifReady", game.modules.get(OIF.ID).api);
        console.log("Automated Objects, Interactions and Effects is ready!!");
    });
});