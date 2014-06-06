part of scene_graph;

/**
 * Camera object used to keep track of the camera position and rotation in the
 * scene.
 */
class Camera {

  int width;
  int height;

  Vector3 position = new Vector3(0.0, 0.0, 0.0);
  Vector3 rotation = new Vector3(0.0, 0.0, 0.0);

  /**
   * Camera's projection matrix.
   */
  Matrix4 projection;

  /**
   * Default constructor. Constructs a camera at (0,0,0) with rotation (0,0,0).
   * [width] and [height] are used to calculate the screen aspect ratio and
   * keep track of the viewport width/height.
   */

  Camera(int width, int height): width = width, height = height {
    projection = makePerspectiveMatrix(radians(45.0), width / height, 1, 100);
  }

  /**
   * Generates and returns the view matrix of the camera,
   * calculated from the camera's [position] and [rotation].
   */

  Matrix4 getViewMatrix() {
    Matrix4 cameraModelMatrix = (new Matrix4.translation(this.position))
    .rotateX(rotation[0])
    .rotateY(rotation[1])
    .rotateZ(rotation[2]);

    Matrix4 viewMatrix = new Matrix4.identity();
    viewMatrix.copyInverse(cameraModelMatrix);

    return viewMatrix;
  }

  /**
   * Moves the camera to [position].
   */

  void moveTo(Vector3 position) {
    this.position = position;
  }

  /**
   * Moves the camera by [delta] relative to current position.
   */

  void moveBy(Vector3 delta) {
    this.position += delta;
  }

  /**
   * Sets the camera's rotation to [rotation].
   */

  void rotateTo(Vector3 rotation) {
    this.rotation = rotation;
  }

  /**
   * Adjusts th camera's rotation by [delta].
   */

  void rotateBy(Vector3 delta) {
    this.rotation += delta;
  }
}