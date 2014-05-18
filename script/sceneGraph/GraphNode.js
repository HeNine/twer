define(["sceneGraph/ModelViewMatrix"],
    function () {
        "use strict";

        /**
         * A node in the scene graph.
         * @constructor
         */
        var GraphNode = function () {
            /**
             *
             * @type {GraphNode[]}
             */
            this.children = [];
        };

        /**
         *
         * @param {GraphNode} node
         */
        GraphNode.prototype.append = function (node) {
            this.children.push(node);
        };

        return GraphNode;
    }
);