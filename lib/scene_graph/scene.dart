part of scene_graph;

/**
 * Represents a scene to be rendered.
 */
class Scene {

  gl.RenderingContext context;
  ResourceManager resourceManager;

  /**
   * The root node of the scene graph.
   */
  GraphNode root = new TransformNode((mat4) => mat4);
  Camera camera;

  Map<String, Set<RenderInstruction>> instructions = new Map();

  Scene(ResourceManager resourceManager, gl.RenderingContext context,
        int viewportWidth,
        int viewportHeight) : resourceManager = resourceManager, this.context = context {

    context.clearColor(0, 0, 0, 1);
    context.enable(gl.DEPTH_TEST);

    camera = new Camera(viewportWidth, viewportHeight);
  }

  /**
   * Recalculate the modelview matrix and shader for all objects in the scene.
   */

  void refresh() {
    (this.root as TransformNode).transform = (
        mat4) => this.camera.getViewMatrix();
    this.instructions.clear();

    RenderVisitor visitor = new RenderVisitor(this.context);

    visitor.process(this.root);

    for (RenderInstruction instruction in visitor.instructions) {

      if (!this.instructions.containsKey(instruction.shader.id)) {
        this.instructions[instruction.shader.id] = new Set();
      }

      this.instructions[instruction.shader.id].add(instruction);
    }
  }

  /**
   * Render the scene to screen using instructions calculated by refresh.
   */

  void render() {

    this.context.viewport(0, 0, this.camera.width, this.camera.height);
    this.context.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (String shaderId in instructions.keys) {
      Shader shader = this.resourceManager.getResource(ResourceManager.SHADER,
      resourceId:shaderId);

      shader.use(this.camera.projection);

      for (RenderInstruction instruction in this.instructions[shaderId]) {
        instruction.object.model.draw(instruction.matrix);
      }
    }

  }
}

