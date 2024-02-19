import { ObjectsInteractionsFX as OIF } from "../../ObjectsInteractionsFX.js";

export class ConfigSkeleton extends FormApplication {
  static get defaultOptions() {
    const DefaultOptions = super.defaultOptions;

    const OverrideOptions = {
      closeOnSubmit: false,
      height: 'auto',
      width: 600,
      submitOnChange: true,
      template: OIF.TEMPLATES.CONFIG_SKELETON,
      caller: null,
      updaterFunction: null,
      configurationData: {},
      dataNameAtSingleton: '',
    };

    const MergedOptions = foundry.utils.mergeObject(DefaultOptions, OverrideOptions);
    return MergedOptions;
  }

  ////////////////////////////////////////////////////////////
  // Get the data from the singleton
  ////////////////////////////////////////////////////////////
  async _updateDataAtSingleton(topography, data)
  {
    // Separate string into array of strings using the dot
    // as separator
    let Location = topography.split('.');

    let Data = this.options.configurationData;
    for (let i = 0; i < Location.length; i++)
    {
      let Piece = Location[i];
      if (!Data.hasOwnProperty(Piece))
      {
        Data[Piece] = {};
      }
      if (i == Location.length - 1)
      {
        Data[Piece] = data;
      }
      Data = Data[Piece];
    }


    return this.options.configurationData;
  }

  ////////////////////////////////////////////////////////////
  // Handle checkbox change
  ////////////////////////////////////////////////////////////
  async _handleCheckboxChange(event)
  {
    let ClickedElement = $(event.currentTarget)[0];
    let Data = await this._updateDataAtSingleton(ClickedElement.name, ClickedElement.checked);

    this.options.configurationData = Data;
    await this.options.updaterFunction(this.options.dataNameAtSingleton, Data);

    this.render();
    this.options.caller?.render();
  }

  ////////////////////////////////////////////////////////////
  // Handle slider change
  ////////////////////////////////////////////////////////////
  async _handleSliderChange(event)
  {
    let ClickedElement = $(event.currentTarget)[0];
    let Data = await this._updateDataAtSingleton(ClickedElement.name, ClickedElement.value);

    this.options.configurationData = Data;
    await this.options.updaterFunction(this.options.dataNameAtSingleton, Data);

    this.render();
    this.options.caller?.render();
  }

  ////////////////////////////////////////////////////////////
  // Handle dropdown change
  ////////////////////////////////////////////////////////////
  async _handleDropdownChange(event)
  {
    let ClickedElement = $(event.currentTarget)[0];
    let Data = await this._updateDataAtSingleton(ClickedElement.name, ClickedElement.value);

    this.options.configurationData = Data;
    await this.options.updaterFunction(this.options.dataNameAtSingleton, Data);

    this.render();
    this.options.caller?.render();
  }

  ////////////////////////////////////////////////////////////
  // Handle text change
  ////////////////////////////////////////////////////////////
  async _handleTextChange(event)
  {
    let ClickedElement = $(event.currentTarget)[0];
    let Data = await this._updateDataAtSingleton(ClickedElement.name, ClickedElement.value);

    this.options.configurationData = Data;
    await this.options.updaterFunction(this.options.dataNameAtSingleton, Data);

    this.render();
    this.options.caller?.render();
  }

  ////////////////////////////////////////////////////////////
  // Handle color change
  ////////////////////////////////////////////////////////////
  async _handleColorChange(event)
  {
    let ClickedElement = $(event.currentTarget)[0];
    let Data = await this._updateDataAtSingleton(ClickedElement.name, ClickedElement.value);

    this.options.configurationData = Data;
    await this.options.updaterFunction(this.options.dataNameAtSingleton, Data);

    this.render();
    this.options.caller?.render();
  }

  ////////////////////////////////////////////////////////////
  // Activate listeners
  ////////////////////////////////////////////////////////////
  activateListeners(html)
  {
    super.activateListeners(html);

    // Checkbox
    html.on('change', 'input[type="checkbox"]', this._handleCheckboxChange.bind(this));
    // Slider
    html.on('change', 'input[type="range"]', this._handleTextChange.bind(this));
    html.on('change', 'input[type="number"]', this._handleTextChange.bind(this));
    // String
    html.on('change', 'input[type="text"]', this._handleTextChange.bind(this));
    // Dropdown
    html.on('change', 'select', this._handleDropdownChange.bind(this));
    // Color
    html.on('change', 'input[type="color"]', this._handleColorChange.bind(this));
  }
}
