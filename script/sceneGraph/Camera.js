define(["lib/gl-matrix"],
    function (glm) {
        "use strict";

        /**
         * @constructor
         */
        var Camera = function (nWidth, nHeight) {
            this.position = glm.vec3.fromValues(0, 0, 0);
            this.rotation = glm.vec3.fromValues(0, 0, 0);

            this.nWidth = nWidth;
            this.nHeight = nHeight;

            this.mProjection = glm.mat4.perspective(glm.mat4.create(), Math.PI / 180 * 50, nWidth / nHeight, 0.1, 100);

        };

        /**
         * Move camera to position.
         *
         * @param {glm.vec3} position
         */
        Camera.prototype.moveTo = function (position) {
            this.position = position;
        };

        /**
         * Set camera rotation to {@code rotation}.
         *
         * @param {glm.vec3} rotation
         */
        Camera.prototype.rotateTo = function (rotation) {
            this.rotation = rotation;
        };

        /**
         * Move camera relative to current position.
         *
         * @param {glm.vec3} moveDelta
         */
        Camera.prototype.moveBy = function (moveDelta) {
            glm.vec3.add(this.position, this.position, moveDelta);
        };

        /**
         * Rotate camera relative to current rotation.
         *
         * @param {glm.vec3} rotateDelta
         */
        Camera.prototype.moveBy = function (rotateDelta) {
            glm.vec3.add(this.position, this.position, rotateDelta);
        };

        return Camera;
    }
);