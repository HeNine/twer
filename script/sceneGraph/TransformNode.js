define(["lib/gl-matrix", "sceneGraph/ModelViewMatrix", "sceneGraph/GraphNode"],
    function (glm, ModelViewMatrix, GraphNode) {
        "use strict";

        /**
         *
         * @param {function(glm.mat4):glm.mat4} transform
         * @constructor
         * @extends {GraphNode}
         */
        var TransformNode = function (transform) {
            GraphNode.call(this);
            this.transform = transform;
        };

        TransformNode.prototype = Object.create(GraphNode.prototype);
//        TransformNode.prototype.constructor = TransformNode;

        return TransformNode;
    }
);