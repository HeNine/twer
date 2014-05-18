define(["lib/gl-matrix"],
    function (glm) {
        "use strict";

        /**
         *
         * @constructor
         */
        var ModelViewMatrix = function () {
            /**
             *
             * @type {mat4[]}
             */
            this.matrixStack = [];
            /**
             *
             * @type {mat4}
             */
            this.matrix = glm.mat4.identity(glm.mat4.create());
        };

        /**
         *
         * @param {function(glm.mat4):glm.mat4} transform
         */
        ModelViewMatrix.prototype.push = function (transform) {
            this.matrixStack.push(this.matrix);
            this.matrix = transform(glm.mat4.clone(this.matrix));
        };

        /**
         *
         */
        ModelViewMatrix.prototype.pop = function () {
            if (this.matrixStack.length !== 0) {
                this.matrix = this.matrixStack.pop();
            }
        };

        return ModelViewMatrix;
    }
);