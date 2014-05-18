define([],
    function () {
        "use strict";

        /**
         *
         * @constructor
         * @param {{id:string, vertex:string, fragment:string}} jShader Shader JSON object
         * @param {string} sVertexShader Vertex shader as source text
         * @param {string} sFragmentShader Fragment shader as source text
         * @param gl OpenGL context object
         */
        var Shader = function (jShader, sVertexShader, sFragmentShader, gl) {
            this.id = jShader.id;
            this.gl = gl;

            this.glVertexShader = gl.createShader(gl.VERTEX_SHADER);
            this.glFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

            gl.shaderSource(this.glVertexShader, sVertexShader);
            gl.compileShader(this.glVertexShader);
            if (!gl.getShaderParameter(this.glVertexShader, gl.COMPILE_STATUS)) {
                window.alert(gl.getShaderInfoLog(this.glVertexShader));
            }

            gl.shaderSource(this.glFragmentShader, sFragmentShader);
            gl.compileShader(this.glFragmentShader);
            if (!gl.getShaderParameter(this.glFragmentShader, gl.COMPILE_STATUS)) {
                window.alert(gl.getShaderInfoLog(this.glFragmentShader));
            }

            this.glProgram = gl.createProgram();
            gl.attachShader(this.glProgram, this.glVertexShader);
            gl.attachShader(this.glProgram, this.glFragmentShader);
            gl.linkProgram(this.glProgram);
            if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
                window.alert("Could not initialise shaders");
            }

            this.glVertexPositionAttribute = gl.getAttribLocation(this.glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(this.glVertexPositionAttribute);
            this.glTextureCoordinateAttribute = gl.getAttribLocation(this.glProgram, "aTextureCoordinate");
            gl.enableVertexAttribArray(this.glTextureCoordinateAttribute);
            this.glTextureUniform = gl.getUniformLocation(this.glProgram, "uTexture");

            this.mProjection = gl.getUniformLocation(this.glProgram, "uPMatrix");
            this.mModelView = gl.getUniformLocation(this.glProgram, "uMVMatrix");

        };

        Shader.prototype.use = function (mProjection) {
            this.gl.useProgram(this.glProgram);
            this.gl.uniformMatrix4fv(this.mProjection, false, mProjection);
        };

        return Shader;
    }
);