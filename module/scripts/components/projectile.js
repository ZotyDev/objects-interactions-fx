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
// ? This component contains everything that a projectile needs in order the be
// ? defined and used.
import { Constants as C } from "../constants.js";

import { GeneralSettings } from "../interface/GeneralSettings.js";
import { InventoryManipulator } from "../library/inventoryManipulator.js";
import { ItemDropper } from "../library/itemDropper.js";
import { ObjectsInteractionsFX as OIF } from "../ObjectsInteractionsFX.js";

export class Projectile {
  constructor(options) {
    // Check if arguments are valid
    if (!Toolbox.check(options)) {
      throw new Error('"options" is invalid');
    }

    this.options = options;

    return this;
  }

  async fire() {
    // Debug
    C.D.info('Projectile.fire()');

    const options = this.options;

    // Debug
    C.D.info('Passed options:', options);

    for (const target of options.targets) {
      // Debug
      C.D.info('Handling', target);

      let resultPosition = {};

      // Check if animation should be played
      if (GeneralSettings.Get(OIF.SETTINGS.GENERAL.USE_ANIMATIONS) && options.animation?.fire?.source != undefined) {
        const sequenceIdentifier = `${C.ID}.${options.name}.${options.author.id}.${target.target.id}`;

        // Debug
        C.D.info(`Playing "${sequenceIdentifier}" sequence...`);

        let sequenceEffect = new Sequence(C.ID)
        .effect()
        .file(options.animation.fire.source)
        .atLocation(options.author)
        .stretchTo(target.target)
        .name(sequenceIdentifier)
        .missed(target.miss ?? false)

        // Play sequence
        await sequenceEffect.play();

        // Debug
        C.D.info(`Finished requesting ${sequenceIdentifier}`);

        // Get where the animation landed
        const [effect] = Sequencer.EffectManager.getEffects({ name: sequenceIdentifier });
        resultPosition.x = effect.targetPosition.x - canvas.dimensions.size / 2;
        resultPosition.y = effect.targetPosition.y - canvas.dimensions.size / 2;
      } else {
        // Get a random place to simulate where the projectile landed
        const corners = Toolbox.getTokenCorners(target.target);
        const randomCorners = corners[Math.floor(Math.random() * corners.length)];
        resultPosition.x = randomCorners.x;
        resultPosition.y = randomCorners.y;
      }

      // Interactions
      setTimeout(() => {
        // TODO: call the post animation hook
        // TODO: call the hit hook

        let didInteract = false;
        // Check if the item should or not break
        if (!(Toolbox.randomIntMax(100) <= options.item.breakChance)) {
          let shouldRemove = false;

          // TODO: only do item interactions if the item is present
          // Check if the attack missed and if a item pile should be created
          if (target.miss && options.item.dropOnMiss) {
            // Debug
            C.D.info('Dropping missed item...');

            // Drop item
            ItemDropper.dropAt(options.item.source, 1, resultPosition);

            // Mark for removal
            shouldRemove = true;
            // Add item to target's inventory
          } else if (options.item.addToTarget) {
            // Debug
            C.D.info('Adding hit item...');

            InventoryManipulator.addItem(target.target.actor, options.item.source, 1);

            // Mark for removal
            shouldRemove = true;
          } else if (options.dropOnHit) {
            // Debug
            C.D.info('')

            // Drop item
            ItemDropper.dropAt(options.item.source, 1, resultPosition);
          }

          // Check if source item should be removed
          if (options.item.remove && shouldRemove) {
            InventoryManipulator.removeItem(target.target.actor, options.item.source, 1);
          }

          didInteract = true;
        }

        // Check if powerful impact effect should be played
        if ((target.powerful || options.tags.includes('powerful')) && GeneralSettings.Get(OIF.SETTINGS.GENERAL.POWERFUL_IMPACT_SHAKE_EFFECT)) {
          ChromaticCanvas.shake();
          didInteract = true;
        }

        // TODO: Call post interaction hook
        if (didInteract) {

        }
      }, options.animation.delay ?? 0);
    }
  }

  return() {
  }
}
