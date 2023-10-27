import { ObjectsInteractionsFX as OIF } from "./ObjectsInteractionsFX.js";
import { Settings } from "./Settings.js";
import { SystemSupporter } from "./system/SystemSupporter.js";
import { MasterTagsSettings } from "./interface/MasterTagsSettings.js";
import { GeneralSettings } from "./interface/GeneralSettings.js";
import { ObjectsInteractionsFXData } from "./data/ObjectsInteractionsFXData.js";
import { TagHandler } from "./tags/TagHandler.js";
import { TokenLightingManipulator } from "./library/TokenLightingManipulator.js";
import { Debug as DBG } from "./library/Debug.js";

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

        const Configuration =
        {
            name: 'configuration',
            title: game.i18n.localize('OIF.Tooltips.Configuration.Title'),
            icon: 'fas fa-gears',
            onClick: async () => {
                new GeneralSettings().render(true);
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
                ClearLighting,
                Configuration
            ]
        });
    })

    Hooks.on("ready", async () => {
        await SystemSupporter.Initialize();
        await Settings.Initialize();
        await DBG.Initialize();

        // Check for missing modules
        let requiredModules = game.modules.get(OIF.ID).relationships.requires;
        for (let module of requiredModules) {
            if (!(game.modules.get(module.id)?.active)) {
                ui.notifications.error(game.i18n.localize('OIF.Core.MissingRequiredModule').replace('$module', module.id));
            }
        }

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
        }

        DBG.Log('First breakpoint');

        // Load default packs
        await MasterTagsSettings.LoadFromConfig();

        DBG.Log('Second breakpoint');

        ////////////////////////////////////////////////////////////
        // Hooks to attach
        ////////////////////////////////////////////////////////////
        let HooksToAttach =
        {
            attack:
            {
                hook: GeneralSettings.Get(OIF.SETTINGS.GENERAL.ATTACH_HOOKS.ATTACK),
                id  : 0
            },
            item:
            {
                hook: GeneralSettings.Get(OIF.SETTINGS.GENERAL.ATTACH_HOOKS.ITEM),
                id  : 0
            }
        }
        Hooks.on(OIF.HOOKS.CHANGE_SETTINGS, async (settings) =>
        {
            DBG.Log('Changing settings', settings);

            // Update the hooks to attach
            HooksToAttach.attack.hook = GeneralSettings.Get(OIF.SETTINGS.GENERAL.ATTACH_HOOKS.ATTACK);
            HooksToAttach.item.hook   = GeneralSettings.Get(OIF.SETTINGS.GENERAL.ATTACH_HOOKS.ITEM);
            Hooks.call(OIF.HOOKS.ATTACH_HOOKS);
        });
        Hooks.on(OIF.HOOKS.ATTACH_HOOKS, async () =>
        {
            DBG.Log('Attaching hooks', HooksToAttach);

            if (HooksToAttach.attack.id != 0)
            {
                Hooks.off(HooksToAttach.attack.hook, HooksToAttach.attack.id);
            }
            if (HooksToAttach.item.id != 0)
            {
                Hooks.off(HooksToAttach.item.hook, HooksToAttach.item.id);
            }

            ////////////////////////////////////////////////////////////
            // Attack Hook
            ////////////////////////////////////////////////////////////
            HooksToAttach.attack.id = Hooks.on(HooksToAttach.attack.hook, async (arg1, arg2, arg3) =>
            {
                // Extract relevant information
                let Workflow = [arg1, arg2, arg3];
                let Options = await SystemSupporter.ExtractOptions(Workflow, 'attack', HooksToAttach.attack.hook);

                // Start the workflow
                Hooks.call(OIF.HOOKS.WORKFLOW.POST_PREPARE, Options);
                DBG.Log('Post prepare hook called from attack hook', HooksToAttach.attack.hook,  Options);
            });

            ////////////////////////////////////////////////////////////
            // Item Hook
            ////////////////////////////////////////////////////////////
            HooksToAttach.item.id = Hooks.on(HooksToAttach.item.hook, async (arg1, arg2, arg3) =>
            {
                // Extract relevant information
                let Workflow = [arg1, arg2, arg3];
                let Options = await SystemSupporter.ExtractOptions(Workflow, 'item', HooksToAttach.item.hook);

                // Start the workflow
                Hooks.call(OIF.HOOKS.WORKFLOW.POST_PREPARE, Options);
                DBG.Log('Post prepare hook called from item hook', HooksToAttach.item.hook, Options);
            });
        });

        ////////////////////////////////////////////////////////////
        // Main workflow
        ////////////////////////////////////////////////////////////
        Hooks.on(OIF.HOOKS.WORKFLOW.POST_PREPARE, async (options) =>
        {
            DBG.Log('Post prepare hook called', options);
            // Check if there are tags to be used
            if (options.tags.length > 0)
            {
                // Send tags to the handler
                TagHandler.Dispatch(options);
            }
        });

        Hooks.call(OIF.HOOKS.ATTACH_HOOKS);
        Hooks.callAll("oifReady", game.modules.get(OIF.ID).api);
        console.log("Automated Objects, Interactions and Effects is ready!!");
    });
});
