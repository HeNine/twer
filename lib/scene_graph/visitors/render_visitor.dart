part of scene_graph;

/**
 * A visitor that traverses the scene graph and calculates every object's
 * rendering instruction.
 */
class RenderVisitor implements GraphVisitor {

  ModelViewMatrix mvMatrix = new ModelViewMatrix();

  gl.RenderingContext context;

  List<RenderInstruction> instructions = new List();

  RenderVisitor(gl.RenderingContext context) : this.context = context;


  void process(GraphNode node) {
    if (node is ObjectNode) {

      RenderInstruction instruction = new RenderInstruction(node,
      this.mvMatrix.matrix,
      (node as ObjectNode).model.shader);
      this.instructions.add(instruction);

      for (GraphNode child in node.children) {
        this.process(child);
      }

    } else if (node is TransformNode) {
      this.mvMatrix.push(node.transform);

      for (GraphNode child in node.children) {
        this.process(child);
      }

      this.mvMatrix.pop();
    }
  }

}

/**
 * Data required to render an object.
 */
class RenderInstruction {
  final ObjectNode object;
  final Matrix4 matrix;
  final Shader shader;

  RenderInstruction(ObjectNode object, Matrix4 matrix, Shader shader) :
  object = object,
  matrix = matrix,
  shader = shader;
}