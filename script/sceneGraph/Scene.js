define(["sceneGraph/Camera", "sceneGraph/TransformNode", "sceneGraph/visitor/RenderVisitor", "resourceManager/ResourceManager"],
    function (Camera, TransformNode, RenderVisitor, ResourceManager) {
        "use strict";

        /**
         *
         * @param {ResourceManager} ResourceManager
         * @constructor
         * @param gl
         * @param nViewportWidth
         * @param nViewportHeight
         */
        var Scene = function (ResourceManager, gl, nViewportWidth, nViewportHeight) {
            this.gl = gl;
            this.resourceManager = ResourceManager;

            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);

            this.camera = new Camera(nViewportWidth, nViewportHeight);
            this.root = new TransformNode(function (mMatrix) {
                return mMatrix;
            });

            this.oInstructions = {shaders: []};
        };

        Scene.prototype.refresh = function () {
            var oVisitor = new RenderVisitor();

            oVisitor.process(this.root);

            var aInstructions = oVisitor.instructions;
            var oSorted = {shaders: []};
            for (var i = 0; i < aInstructions.length; i++) {
                var oInstruction = aInstructions[i];

                if (!oSorted[oInstruction.shader.id]) {
                    oSorted[oInstruction.shader.id] = [];
                    oSorted.shaders.push(oInstruction.shader.id);
                }

                oSorted[oInstruction.shader.id].push(oInstruction);
            }

            this.oInstructions = oSorted;
        };

        Scene.prototype.render = function () {
            /* jshint bitwise: false */
            /* jshint loopfunc: true */
            this.gl.viewport(0, 0, this.camera.nWidth, this.camera.nHeight);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            var thi$ = this;
            for (var i = 0; i < this.oInstructions.shaders.length; i++) {
                var sShader = this.oInstructions.shaders[i];
                this.resourceManager.getResource({id: sShader}, ResourceManager.ResourceType.SHADER, function (oShader) {
                    thi$.renderWithShader(oShader, thi$);
                });
            }
        };

        /**
         *
         * @param {Shader} oShader
         */
        Scene.prototype.renderWithShader = function (oShader, thi$) {
            oShader.use(thi$.camera.mProjection);

            var aShaderInstructions = thi$.oInstructions[oShader.id];
            for (var i = 0; i < aShaderInstructions.length; i++) {
                var oInstruction = aShaderInstructions[i];

                oInstruction.object.model.draw(oInstruction.matrix);
            }
        };

        return Scene;
    }
);