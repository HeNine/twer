part of scene_graph;

/**
 * Graph node to represent an object with model [model].
 */
class ObjectNode extends GraphNode {
  /**
   * The model used to draw this object.
   */
  Model model;

  ObjectNode(Model model) : model = model;
}