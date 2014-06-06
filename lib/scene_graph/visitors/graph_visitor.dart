part of scene_graph;

/**
 * An abstract class to represent a scene graph visitor.
 */
abstract class GraphVisitor {
  void process(GraphNode node);
}