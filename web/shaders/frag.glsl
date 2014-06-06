precision mediump float;

varying vec2 vTextureCoordinate;

uniform sampler2D uTexture;

void main(void) {
  gl_FragColor = texture2D(uTexture, vec2(vTextureCoordinate.s, vTextureCoordinate.t));
}