define(["jquery", "resourceManager/Model", "resourceManager/Shader", "resourceManager/Texture"],
    function ($, Model, Shader, Texture) {
        "use strict";

        /**
         *
         * @constructor
         * @param gl OpenGL context
         */
        var ResourceManager = function (gl) {
            this.shaders = {};
            this.models = {};
            this.textures = {};
            this.gl = gl;
        };

        /**
         * Possible resource types.
         * @enum {string}
         */
        ResourceManager.ResourceType = {
            SHADER: "shader",
            MODEL: "model",
            TEXTURE: "texture"
        };

        /**
         *
         * @param {{url:?string, id:?string}} resourceId
         * @param {ResourceManager.ResourceType} resourceType
         * @param {function(resource)} callback
         * @returns {*}
         */
        ResourceManager.prototype.getResource = function (resourceId, resourceType, callback) {
            if (typeof resourceId !== "object" || !resourceId.id && !resourceId.url) {
                throw "Resource ID must be object.";
            }

            if (resourceType === ResourceManager.ResourceType.MODEL) {
                if (!this.models[resourceId.id] && resourceId.url) {
                    this.loadModel(resourceId.url, callback);
                } else {
                    callback(this.models[resourceId.id]);
                }
            } else if (resourceType === ResourceManager.ResourceType.SHADER) {
                if (!this.shaders[resourceId.id] && resourceId.url) {
                    this.loadShader(resourceId.url, callback);
                } else {
                    callback(this.shaders[resourceId.id]);
                }
            } else if (resourceType === ResourceManager.ResourceType.TEXTURE) {
                if (!this.textures[resourceId.id] && resourceId.url) {
                    this.loadTexture(resourceId.url, callback);
                } else {
                    callback(this.textures[resourceId.id]);
                }
            }
        };

        ResourceManager.prototype.loadModel = function (url, callback) {
            var thi$ = this;
            $.getJSON(url,
                function (jModel) {
                    thi$.getResource(jModel.shader, ResourceManager.ResourceType.SHADER, function (oShader) {
                        thi$.models[jModel.id] = new Model(jModel, oShader, thi$.gl);
                        callback(thi$.models[jModel.id]);
                    });
                }
            );
        };

        ResourceManager.prototype.loadShader = function (url, callback) {
            var thi$ = this;
            var baseUrl = url.split("/");
            baseUrl.pop();
            baseUrl = baseUrl.join("/") + "/";

            $.getJSON(
                url,
                function (jShader) {
                    $.get(baseUrl + jShader.vertex,
                        function (sVertexSource) {
                            $.get(baseUrl + jShader.fragment,
                                function (sFragmentSource) {
                                    thi$.shaders[jShader.id] = new Shader(jShader, sVertexSource, sFragmentSource, thi$.gl);
                                    callback(thi$.shaders[jShader.id]);
                                }, "text");
                        },
                        "text");
                }
            );
        };

        ResourceManager.prototype.loadTexture = function (url) {

        };

        return ResourceManager;
    }
);