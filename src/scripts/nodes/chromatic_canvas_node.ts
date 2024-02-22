// @ts-nocheck
export class ChromaticCanvasNode {
  constructor() {
    this.title = "Chromatic Canvas";
    this.addInput("intensity", "number");
  }

  onExecute() {
    let intensity = this.getInputData(0) || 0;

    console.log('shaking');
  }
}
