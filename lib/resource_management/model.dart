part of resource_management;

/**
 * A model resource.
 */
class Model extends Resource {

  bool loaded = false;

  gl.RenderingContext context;

  Shader shader;

  List<List<double>> vertices;
  List<List<double>> normals;
  List<List<double>> textureCoords;
  List<List<int>> faces;

  gl.Texture texture;

  ImageElement textureImage = new ImageElement();

  gl.Buffer verticesBuffer;
  gl.Buffer normalsBuffer;
  gl.Buffer textureCoordsBuffer;
  gl.Buffer facesBuffer;

  Model(Map modelJSON, Shader shader,
        gl.RenderingContext context) :
  this.context = context,
  this.shader = shader,
  this.texture = context.createTexture(),
  this.verticesBuffer = context.createBuffer(),
  this.normalsBuffer = context.createBuffer(),
  this.textureCoordsBuffer = context.createBuffer(),
  this.facesBuffer = context.createBuffer(),
  super(modelJSON['id']) {

    if (modelJSON['vertices'].length != modelJSON['normals'].length ||
    modelJSON['vertices'].length != modelJSON['textureCoords'].length) {
      throw new Exception('Invalid model JSON');
    }

    this.vertices = modelJSON['vertices'];
    this.normals = modelJSON['normals'];
    this.textureCoords = modelJSON['textureCoords'];
    this.faces = modelJSON['faces'];

    textureImage.onLoad.listen((e) {
      this.context.bindTexture(gl.TEXTURE_2D, this.texture);
      this.context.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      this.context.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
      gl.UNSIGNED_BYTE, this.textureImage);
      this.context.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
      gl.LINEAR);
      this.context.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR);
      this.context.generateMipmap(gl.TEXTURE_2D);
      var aniso = this.context.getExtension('EXT_texture_filter_anisotropic');
      if (aniso) {
        this.context.texParameterf(gl.TEXTURE_2D,
        aniso.TEXTURE_MAX_ANISOTROPY_EXT, 16);
      }
      this.context.bindTexture(gl.TEXTURE_2D, null);

      this.loaded = true;
    });
    textureImage.src = modelJSON['textureImage'];

    context.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
    context.bufferDataTyped(gl.ARRAY_BUFFER,
    new Float32List.fromList(flatten(this.vertices).map((
        x) => x.toDouble()).toList()),
    gl.STATIC_DRAW);

    context.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
    context.bufferDataTyped(gl.ARRAY_BUFFER,
    new Float32List.fromList(flatten(this.normals).map((
        x) => x.toDouble()).toList()),
    gl.STATIC_DRAW);

    context.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordsBuffer);
    context.bufferDataTyped(gl.ARRAY_BUFFER,
    new Float32List.fromList(flatten(this.textureCoords).map((
        x) => x.toDouble()).toList()), gl.STATIC_DRAW);

    context.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
    context.bufferDataTyped(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16List.fromList(flatten(this.faces)), gl.STATIC_DRAW);
  }

  void draw(Matrix4 mvMatrix) {
    if (this.loaded) {
      this.context.uniformMatrix4fv(this.shader.modelViewUniform, false,
      mvMatrix.storage);

      this.context.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
      this.context.vertexAttribPointer(this.shader.vertexPositionAttribute, 3,
      gl.FLOAT, false, 0, 0);

      this.context.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordsBuffer);
      this.context.vertexAttribPointer(this.shader.textureCoordinateAttribute,
      2, gl.FLOAT, false, 0, 0);

      this.context.activeTexture(gl.TEXTURE0);
      this.context.bindTexture(gl.TEXTURE_2D, this.texture);
      this.context.uniform1i(this.shader.textureUniform, 0);

      this.context.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
      this.context.drawElements(gl.TRIANGLES, this.faces.length * 3,
      gl.UNSIGNED_SHORT, 0);
    }
  }
}

List<num> flatten(List<List<num>> list) {
  return list.fold(new List(), (prev, curr) => prev
    .. addAll(curr));
}