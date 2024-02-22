// @ts-nocheck
import { LiteGraph } from "litegraph.js";
import { ChromaticCanvasNode } from "./chromatic_canvas_node";

export class NodesDb {
  static initialize() {
    LiteGraph.registerNodeType("effects/chromatic_canvas", ChromaticCanvasNode);
  }
}
