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

            this.mProjection = glm.mat4.perspective(glm.mat4.create(), Math.PI / 180 * 45, nWidth / nHeight, 0.1, 100);

        };

        Camera.prototype.getMatrix = function () {
            var translate = glm.mat4.create();
            glm.mat4.translate(translate, translate, this.position);

            var rotateX = glm.mat4.create();
            glm.mat4.rotateX(
                rotateX,
                rotateX,
                    this.rotation[0] * Math.PI / 180);
            var rotateY = glm.mat4.create();
            glm.mat4.rotateY(
                rotateY,
                rotateY,
                    this.rotation[1] * Math.PI / 180);
            var rotateZ = glm.mat4.create();
            glm.mat4.rotateZ(
                rotateZ,
                rotateZ,
                    this.rotation[2] * Math.PI / 180);

            glm.mat4.mul(translate, translate, rotateX);
            glm.mat4.mul(translate, translate, rotateY);
            glm.mat4.mul(translate, translate, rotateZ);
            glm.mat4.invert(translate, translate);

            return translate;
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
        Camera.prototype.rotateBy = function (rotateDelta) {
            glm.vec3.add(this.rotation, this.rotation, rotateDelta);
        };

        return Camera;
    }
);