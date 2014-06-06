part of resource_management;

class ResourceManager {
  static const int SHADER = 1;
  static const int MODEL = 2;

  gl.RenderingContext context;

  Map<String, Shader> shaders = new Map();
  Map<String, Model> models = new Map();

  ResourceManager(gl.RenderingContext context) : this.context = context;

  /**
   * Returns the resource specified by [resourceId] and/or [resourceURL]. If the resource is loaded it is returned by
   * ID, otherwise [resourceURL] is used to load it.
   */

  Resource getResource(int resourceType,
                       {String resourceId, String resourceURL}) {

    if (resourceType == SHADER) {

      if (resourceId != null && shaders.containsKey(resourceId)) {
        return shaders[resourceId];
      }

      return this.loadShader(resourceURL);

    } else if (resourceType == MODEL) {

      if (resourceId != null && models.containsKey(resourceId)) {
        return models[resourceId];
      }

      return this.loadModel(resourceURL);
    } else {
      throw new Exception('Invalid resource type.');
    }
  }

  Shader loadShader(String shaderURL) {
    HttpRequest shaderRequest = new HttpRequest();
    shaderRequest.open('GET', shaderURL, async:false);
    shaderRequest.send();

    String shaderJSONString = shaderRequest.responseText;
    Map shaderJSON = JSON.decode(shaderJSONString);

    var baseURL = shaderURL.split('/')
      ..removeLast();
    baseURL = baseURL.join('/');

    HttpRequest vertexRequest = new HttpRequest();
    vertexRequest.open('GET', baseURL + '/' + shaderJSON['vertex'],
    async:false);
    vertexRequest.send();
    HttpRequest fragmentRequest = new HttpRequest();
    fragmentRequest.open('GET', baseURL + '/' + shaderJSON['fragment'],
    async:false);
    fragmentRequest.send();

    Shader shader = new Shader(shaderJSON, vertexRequest.responseText,
    fragmentRequest.responseText, this.context);
    this.shaders[shader.id] = shader;

    return shader;
  }

  Model loadModel(String modelURL) {
    HttpRequest modelRequest = new HttpRequest();
    modelRequest.open('GET', modelURL, async:false);
    modelRequest.send();

    String modelJSONString = modelRequest.responseText;
    Map modelJSON = JSON.decode(modelJSONString);

    Model model = new Model(modelJSON, this.getResource(ResourceManager.SHADER,
    resourceId:modelJSON['shader']['id'],
    resourceURL:modelJSON['shader']['url']), this.context);
    this.models[model.id] = model;

    return model;
  }
}