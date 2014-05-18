define(["sceneGraph/ObjectNode", "sceneGraph/TransformNode", "sceneGraph/ModelViewMatrix"],
    function (ObjectNode, TransformNode, ModelViewMatrix) {
        "use strict";

        /**
         *
         * @constructor
         * @implements {GraphVisitor}
         */
        var RenderVisitor = function (gl) {
            this.mvMatrix = new ModelViewMatrix();
            this.gl = gl;
            this.instructions = [];
        };

        /**
         *
         * @param {GraphNode} node
         */
        RenderVisitor.prototype.process = function (node) {
            var i;
            if (node instanceof ObjectNode) {

                var instruction = {object: node, matrix: this.mvMatrix.matrix, shader: node.model.oShader};
                this.instructions.push(instruction);

                for (i = 0; i < node.children.length; i++) {
                    this.process(node.children[i]);
                }

            } else if (node instanceof TransformNode) {
                this.mvMatrix.push(node.transform);

                for (i = 0; i < node.children.length; i++) {
                    this.process(node.children[i]);
                }

                this.mvMatrix.pop();
            }
        };

        return RenderVisitor;
    }
);