part of scene_graph;

typedef Matrix4 Transformation(Matrix4);

/**
 * A node that represents a transformation of the modelview matrix in the
 * scene. This can be used for translation, rotation,
 * scaling or any other transformation that can be represented by applying a
 * function to the current modelview matrix.
 */
class TransformNode extends GraphNode {

  /**
   * The function used to transform the modelview matrix.
   */
  Transformation transform;

  TransformNode(this.transform);
}
