define(["resourceManager/Shader"],
    function () {
        "use strict";

        /**
         * Flattens array by 1 level.
         *
         * @param {Array} array
         * @returns {Array}
         */
        var flatten = function (array) {
            if (typeof array.map === 'function' && typeof array.reduce === 'function') {
                return array.reduce(function (previousValue, currentValue) {
                    return previousValue.concat(currentValue);
                }, []);
            } else {
                return array;
            }
        };

        /**
         *
         * @param jModel
         * @param gl
         * @param {Shader} oShader
         * @constructor
         * @throws {string}
         */
        var Model = function (jModel, oShader, gl) {
            this.loaded = false;
            this.gl = gl;
            this.oShader = oShader;

            if (jModel.vertices.length !== jModel.normals.length ||
                jModel.vertices.length !== jModel.textureCoords.length) {
                throw "Invalid model JSON.";
            }

            this.vertices = jModel.vertices;

            this.normals = jModel.normals;

            this.textureCoords = jModel.textureCoords;

            this.faces = jModel.faces;

            this.glTexture = gl.createTexture();
            this.textureImage = new Image();
            this.textureImage.model = this;
            this.textureImage.onload = this.onTextureLoad;
            this.textureImage.src = jModel.textureImage;

            this.verticesBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(this.vertices)), gl.STATIC_DRAW);

            this.normalsBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(this.normals)), gl.STATIC_DRAW);

            this.textureCoordsBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(this.textureCoords)), gl.STATIC_DRAW);

            this.facesBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flatten(this.faces)), gl.STATIC_DRAW);
        };

        Model.prototype.onTextureLoad = function () {
            var model = this.model;
            model.gl.bindTexture(model.gl.TEXTURE_2D, model.glTexture);
            model.gl.pixelStorei(model.gl.UNPACK_FLIP_Y_WEBGL, true);
            model.gl.texImage2D(model.gl.TEXTURE_2D, 0, model.gl.RGBA, model.gl.RGBA, model.gl.UNSIGNED_BYTE, model.textureImage);
            model.gl.texParameteri(model.gl.TEXTURE_2D, model.gl.TEXTURE_MAG_FILTER, model.gl.LINEAR);
            model.gl.texParameteri(model.gl.TEXTURE_2D, model.gl.TEXTURE_MIN_FILTER, model.gl.LINEAR_MIPMAP_LINEAR);
            model.gl.generateMipmap(model.gl.TEXTURE_2D);
            model.gl.texParameterf(model.gl.TEXTURE_2D, model.gl.aniso.TEXTURE_MAX_ANISOTROPY_EXT, 16);
            model.gl.bindTexture(model.gl.TEXTURE_2D, null);

            model.loaded = true;
        };

        Model.prototype.draw = function (mvMatrix) {
            // TODO move to ObjectNode
            this.gl.uniformMatrix4fv(this.oShader.mModelView, false, mvMatrix);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.verticesBuffer);
            this.gl.vertexAttribPointer(this.oShader.glVertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordsBuffer);
            this.gl.vertexAttribPointer(this.oShader.glTextureCoordinateAttribute, 2, this.gl.FLOAT, false, 0, 0);

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.glTexture);
            this.gl.uniform1i(this.oShader.glTextureUniform, 0);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer);
            this.gl.drawElements(this.gl.TRIANGLES, this.faces.length * 3, this.gl.UNSIGNED_SHORT, 0);
        };

        return Model;
    }
);