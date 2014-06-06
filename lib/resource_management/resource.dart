part of resource_management;

/**
 * Resource base class.
 */
abstract class Resource {
  /**
   * A unique identifier for the resource
   */
  String id;

  Resource(String id) {
    this.id = id;
  }

}