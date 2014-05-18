precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoordinate;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoordinate;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoordinate = aTextureCoordinate;
}