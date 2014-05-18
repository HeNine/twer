define(["sceneGraph/GraphNode", "resourceManager/Model"],
    function (GraphNode) {
        "use strict";

        /**
         *
         * @constructor
         * @extends{GraphNode}
         */
        var ObjectNode = function (model) {
            GraphNode.call(this);
            this.model = model;
        };

        ObjectNode.prototype = Object.create(GraphNode.prototype);
//        ObjectNode.prototype.constructor = ObjectNode;

        return ObjectNode;
    }
);