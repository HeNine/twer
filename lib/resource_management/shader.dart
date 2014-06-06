part of resource_management;

class Shader extends Resource {

  String id;

  gl.RenderingContext context;

  gl.Shader vertexShader;
  gl.Shader fragmentShader;
  gl.Program program;

  int vertexPositionAttribute;
  int textureCoordinateAttribute;
  gl.UniformLocation textureUniform;

  gl.UniformLocation projectionUniform;
  gl.UniformLocation modelViewUniform;

  Shader(Map shaderJSON, String vertexShader, String fragmentShader,
         gl.RenderingContext context) :
  this.context = context,
  this.vertexShader = context.createShader(gl.VERTEX_SHADER),
  this.fragmentShader = context.createShader(gl.FRAGMENT_SHADER),
  this.program = context.createProgram(),
  super(shaderJSON['id']) {

    context.shaderSource(this.vertexShader, vertexShader);
    context.compileShader(this.vertexShader);
    if (!context.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
      window.alert(context.getShaderInfoLog(this.vertexShader));
    }

    context.shaderSource(this.fragmentShader, fragmentShader);
    context.compileShader(this.fragmentShader);
    if (!context.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
      window.alert(context.getShaderInfoLog(this.fragmentShader));
    }

    context.attachShader(this.program, this.vertexShader);
    context.attachShader(this.program, this.fragmentShader);
    context.linkProgram(this.program);
    if (!context.getProgramParameter(this.program, gl.LINK_STATUS)) {
      window.alert('Could not link program');
    }

    this.vertexPositionAttribute = context.getAttribLocation(this.program,
    'aVertexPosition');
    context.enableVertexAttribArray(this.vertexPositionAttribute);
    this.textureCoordinateAttribute = context.getAttribLocation(this.program,
    'aTextureCoordinate');
    context.enableVertexAttribArray(this.textureCoordinateAttribute);
    this.textureUniform = context.getUniformLocation(this.program, 'uTexture');


    this.projectionUniform = context.getUniformLocation(this.program,
    'uPMatrix');
    this.modelViewUniform = context.getUniformLocation(this.program,
    'uMVMatrix');
  }

  void use(Matrix4 projectionMatrix) {
    this.context.useProgram(this.program);
    this.context.uniformMatrix4fv(this.projectionUniform, false,
    projectionMatrix.storage);
  }
}