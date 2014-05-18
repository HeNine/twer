define(["jquery", "lib/gl-matrix", "resourceManager/ResourceManager", "sceneGraph/Scene", "sceneGraph/ObjectNode", "sceneGraph/TransformNode"],
    function ($, glm, ResourceManager, Scene, ObjectNode, TransformNode) {
        "use strict";

        var Game = function () {
            this.canvas = $("#canvas")[0];
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.gl = this.canvas.getContext("experimental-webgl", {antialias: true});
            this.gl.aniso = this.gl.getExtension('EXT_texture_filter_anisotropic');
//            this.gl.fl = this.gl.getExtension("OES_texture_float");
//            this.gl.hfl = this.gl.getExtension("OES_texture_half_float");

            this.resourceManager = new ResourceManager(this.gl);
            this.scene = new Scene(this.resourceManager, this.gl, this.canvas.width, this.canvas.height);

            var thi$ = this;
            var model = this.resourceManager.getResource({url: "models/krejt.json"}, ResourceManager.ResourceType.MODEL,
                function (oModel) {
                    var move = new TransformNode(function (mMatrix) {
                        return glm.mat4.translate(mMatrix, mMatrix, [0, 0, 0]);
                    });
                    thi$.scene.root.append(move);

                    var rotate = new TransformNode(function (mMatrix) {
                        return glm.mat4.rotate(mMatrix, mMatrix, Math.PI / 180 * rotate.r, [1, 2, 3]);
                    });
                    rotate.r = 0;
                    move.append(rotate);

                    var object = new ObjectNode(oModel);
                    rotate.append(object);

                    thi$.scene.camera.moveTo([0, 0, 7]);

                    thi$.scene.refresh();
                }
            );
        };

        Game.prototype.frame = function () {

            this.scene.render();
        };

        return Game;
    }
);