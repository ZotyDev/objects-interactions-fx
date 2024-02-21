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
// ? This module defines a generic node that will be used as a base class to
// ? define all the possible nodes.
import { Pin } from "./pins/pins.js";

/**
 * This is a generic node that will be used as a base class to define all the possible nodes.
 * @class
 * @abstract
 * @constructor
 * @public
 */
export abstract class Node {
  /**
   * Types are responsible for defining what role the node will fit in, current types are:
   * - "trigger" => (defines an entry-point)
   * - "effect"  => (does something)
   * - "control" => (decides if the flow should or not continue)
   */
  type: String;
  /**
    * Inputs are the input values that will be used and available inside the node.
    */
  #inputs: Array<Pin>;
  /**
    * Outputs are the output values that will be passed to the outside environment.
    */
  #outputs: Array<Pin>;

  constructor(type: String, inputs = [], outputs = []) {
    // Set properties
    this.type = type;
    this.#inputs = inputs;
    this.#outputs = outputs;

    // Create the required data
  }

  abstract resolve() : boolean;
}
