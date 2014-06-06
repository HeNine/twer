part of scene_graph;

/**
 * Used to keep track of the modelview matrix during scene graph traversal.
 */
class ModelViewMatrix {

  List<Matrix4> stack = new List();

  Matrix4 matrix = new Matrix4.identity();

  /**
   * Save current matrix on the stack and set current matrix transformed
   * using [transform] as current matrix.
   */

  void push(Matrix4 transform(Matrix4)) {
    this.stack.add(this.matrix);
    this.matrix = transform(this.matrix.clone());
  }

  /**
   * Restore previous matrix as current matrix.
   */

  void pop() {
    if (this.stack.length != 0) {
      this.matrix = this.stack.removeLast();
    }
  }
}