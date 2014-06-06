part of scene_graph;

/**
 * A node in a scene graph. This is the abstract class scene graph nodes must
 * implement.
 */
abstract class GraphNode {
  List<GraphNode> children = new List();

  /**
   * Append a child node to this node.
   */

  void append(GraphNode child) {
    children.add(child);
  }
}