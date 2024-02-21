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
// ? This module defines a generic pin that will be used as a base class to
// ? define all the possible pins.
export enum PinType {
  Input,
  Output,
}

/**
 * This is a generic pin that will be used a base class to define all the possible pins.
 * @class
 * @abstract
 * @constructor
 * @public
 */
export abstract class Pin {
  /**
   * Type of the input
   */
  type: PinType;

  constructor(type: PinType) {
    // Set the properties
    this.type = type;
  }
}

/**
 * This class defines a pin that handles numbers.
 */
export class NumberPin extends Pin {
  /**
   * Current value.
   */
  value: Number;
  /**
   * Minimum value.
   */
  min: Number;
  /**
   * Maximum value.
   */
  max: Number;
  /**
   * How much does the value increments or decrements by.
   */
  step: Number;

  constructor(type: PinType, value = 0.0, min = 0.0, max = 100.0, step = 1.0) {
    super(type);

    // Set the properties
    this.value = value;
    this.min = min;
    this.max = max;
    this.step = step;
  }
}
