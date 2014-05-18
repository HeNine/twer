define([],
    function () {
        "use strict";

        /**
         *
         * @constructor
         * @interface
         */
        var GraphVisitor = function () {
        };

        /**
         *
         * @param {GraphNode} node
         */
        GraphVisitor.prototype.process = function (node) {
        };

        return GraphVisitor;
    }
);