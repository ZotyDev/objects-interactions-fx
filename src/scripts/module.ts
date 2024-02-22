// @ts-nocheck
////////////////////////////////////////////////////////////////////////////////////////////////////
//                                    ███████    █████ ███████████                                //
//                                  ███░░░░░███ ░░███ ░░███░░░░░░█                                //
//                                 ███     ░░███ ░███  ░███   █ ░                                 //
//                                ░███      ░███ ░███  ░███████                                   //
//                                ░███      ░███ ░███  ░███░░░█                                   //
//                                ░░███     ███  ░███  ░███  ░                                    //
//                                 ░░░███████░   █████ █████                                      //
//                                   ░░░░░░░    ░░░░░ ░░░░░                                       //
//                  Automated Objects, Interactions and Effects -  By ZotyDev                     //
////////////////////////////////////////////////////////////////////////////////////////////////////
// ? OIF (Automated Objects, Interactions and Effects) is a module that animates
// ? complex effects and interactions between the players and the game world, it
// ? focus on usability and a simple and easy experience, without needing to
// ? consider little details. OIF have a gamefied approach, thus it may not be
// ? for everyone.
import { ObjectsInteractionsFX as OIF } from "./objects_interactions_fx";
import { Settings } from "./settings";
import { MasterTagsSettings } from "./interface/master_tag_settings";
import { GeneralSettings } from "./interface/general_settings";
import { TagHandler } from "./tags/tag_handler";
import { TokenLightingManipulator } from "./library/token_lighting_manipulator";
import { HandlebarsHelpers } from "./library/handlebars_helpers";

import { Constants as C } from "./constants";
import { OifLayer } from "./oif_layer";

import { EffectManagerApplication } from "./interface/effect_manager";
import { NodesDb } from "./nodes/nodes_db";

const litegraphjs = require("litegraph.js");


////////////////////////////////////////////////////////////////////////////////
// Entry-point for everything
////////////////////////////////////////////////////////////////////////////////
Hooks.once('init', () => {
  Hooks.once('toolbox.ready', async () => {
    Toolbox.showcaseModule(C.NAME_FLAT);

    OIF.Initialize();
    Settings.Initialize();
    HandlebarsHelpers.initialize();

    window['litegraphjs'] = litegraphjs;
    NodesDb.initialize();

    // Check for missing modules
    let requiredModules = game.modules.get(OIF.ID).relationships.requires;
    for (let module of requiredModules) {
      if (!(game.modules.get(module.id)?.active)) {
        ui.notifications.error(game.i18n.localize('OIF.Core.MissingRequiredModule').replace('$module', module.id));
      }
    }

    // Load default packs
    await MasterTagsSettings.LoadFromConfig();

    ////////////////////////////////////////////////////////////
    // Hooks to attach
    ////////////////////////////////////////////////////////////
    let hooksToAttach = {
      attack: {
        hook: GeneralSettings.Get(OIF.SETTINGS.GENERAL.ATTACH_HOOKS.ATTACK),
        id  : 0
      },
      item: {
        hook: GeneralSettings.Get(OIF.SETTINGS.GENERAL.ATTACH_HOOKS.ITEM),
        id  : 0
      }
    }
    Hooks.on(OIF.HOOKS.CHANGE_SETTINGS, async (settings) => {
      // Debug
      C.D.info('Changing settings', settings);

      // Update the hooks to attach
      hooksToAttach.attack.hook = GeneralSettings.Get(OIF.SETTINGS.GENERAL.ATTACH_HOOKS.ATTACK);
      hooksToAttach.item.hook   = GeneralSettings.Get(OIF.SETTINGS.GENERAL.ATTACH_HOOKS.ITEM);

      Hooks.call(OIF.HOOKS.ATTACH_HOOKS);
    });
    Hooks.on(OIF.HOOKS.ATTACH_HOOKS, async () => {
      // Debug
      C.D.info('Attaching hooks', hooksToAttach);

      if (hooksToAttach.attack.id != 0)
      {
        Hooks.off(hooksToAttach.attack.hook, hooksToAttach.attack.id);
      }
      if (hooksToAttach.item.id != 0)
      {
        Hooks.off(hooksToAttach.item.hook, hooksToAttach.item.id);
      }

      ////////////////////////////////////////////////////////////
      // Attack Hook
      ////////////////////////////////////////////////////////////
      // Debug
      C.D.info(`Attaching attack hook "${hooksToAttach.attack.hook}"...`);

      hooksToAttach.attack.id = Hooks.on(hooksToAttach.attack.hook, (arg1, arg2, arg3) => {
        // Extract relevant information
        const workflow = [arg1, arg2, arg3];
        const options = Bifrost.getHookInformation(workflow, 'attack', hooksToAttach.attack.hook);


        if (options) {
          // Start the workflow
          Hooks.call(OIF.HOOKS.WORKFLOW.POST_PREPARE, options);

          // Debug
          C.D.info('Post prepare hook called from attack hook', hooksToAttach.attack.hook,  options);
        } else {
          // Debug
          C.D.info('invalid options, skipping this attempt...');
        }
      });

      ////////////////////////////////////////////////////////////
      // Item Hook
      ////////////////////////////////////////////////////////////
      // Debug
      C.D.info(`Attaching item hook "${hooksToAttach.item.hook}"...`);

      hooksToAttach.item.id = Hooks.on(hooksToAttach.item.hook, (arg1, arg2, arg3) => {
        // Extract relevant information
        const workflow = [arg1, arg2, arg3];
        const options = Bifrost.getHookInformation(workflow, 'item', hooksToAttach.item.hook);

        if (options) {
          // Start the workflow
          Hooks.call(OIF.HOOKS.WORKFLOW.POST_PREPARE, options);

          // Debug
          C.D.info('Post prepare hook called from item hook', hooksToAttach.item.hook, options);
        } else {
          // Debug
          C.D.info('invalid options, skipping this attempt...');
        }
      });
    });

    ////////////////////////////////////////////////////////////
    // Main workflow
    ////////////////////////////////////////////////////////////
    Hooks.on(OIF.HOOKS.WORKFLOW.POST_PREPARE, async (options) => {
      // Debug
      C.D.info('Post prepare hook called', options);

      // Extract tags
      options.tags = ItemTags.get(options.item);

      // Check if there are tags to be used
      if (options.tags.length > 0)
      {
        // Send tags to the handler
        TagHandler.Dispatch(options);
      }
    });

    Hooks.call(OIF.HOOKS.ATTACH_HOOKS);
    Hooks.callAll("oif.ready", game.modules.get(OIF.ID).api);

    // Debug
    C.D.info('Ready!!');
  });

  // Setup the layer where the interface will be
  CONFIG.Canvas.layers['oif'] = {
    group: 'interface',
    layerClass: OifLayer,
  }

  Hooks.on('getSceneControlButtons', (controls) => {
    // Setup listener for the module tools
    if (!canvas.scene) return;

    const masterTagsTool = {
      name: 'master-tags',
      title: game.i18n.localize('OIF.Tooltips.MasterTags.Title'),
      icon: 'fas fa-tags',
      onClick: async () => {
        new MasterTagsSettings().render(true);
      },
      button: true
    }

    const clearLightingTool = {
      name: 'clear-lighting',
      title: game.i18n.localize('OIF.Tooltips.ClearLighting.Title'),
      icon: 'fas fa-lightbulb-slash',
      onClick: async () => {
        TokenLightingManipulator.RemoveAllLighting();
      },
      button: true
    }

    const configurationTool =
    {
      name: 'configuration',
      title: game.i18n.localize('OIF.Tooltips.Configuration.Title'),
      icon: 'fas fa-gears',
      onClick: async () => {
        new GeneralSettings().render(true);
      },
      button: true
    }

    const effectManagerTool = {
      name: 'effect-manager',
      title: 'Effect Manager',
      icon: 'fas fa-wand',
      onClick: async () => {
        new EffectManagerApplication().render(true);
      },
      button: true,
    }

    controls.push({
      name: OIF.ID,
      title: OIF.NAME,
      layer: 'oif',
      icon: 'fas fa-snowflake',
      visible: game.user.isGM,
      tools: [
        masterTagsTool,
        clearLightingTool,
        configurationTool,
        effectManagerTool,
      ]
    });
  });

});

// Debug info
Hooks.once('debugger.ready', () => {
  C.D = new Debugger(C.ID, C.NAME, true, true);
  C.D.info('Module Information:');
  C.D.info(`Version ${game.modules.get(C.ID).version}`);
  C.D.info('Module By ZotDev');
});

// Setup the socket
Hooks.once('socketlib.ready', () =>
{
  C.SOCKET = socketlib.registerModule(C.ID);
})

