requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'script',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        "jquery": '../bower_components/jquery/dist/jquery.min',
        "lib/gl-matrix": "../bower_components/gl-matrix/dist/gl-matrix"
    },

    packages: [
        {
            name: "lib/gl-matrix",
            main: "gl-matrix-min",
            location: "../bower_components/gl-matrix/dist"
        }
    ]
});

requirejs(["Game"], function (Game) {
    'use strict';

    var game = new Game();

    var time = new Date();

    var tick = function () {
        var newTime = new Date();
        var delta = newTime.getTime() - time.getTime();
        time = newTime;

        window.requestAnimationFrame(tick);
        if (game.scene.root.children[0] && game.scene.root.children[0].children[0]) {
            game.scene.root.children[0].children[0].r = (game.scene.root.children[0].children[0].r + 1 * (delta / 1000) * 60) % (360 * 3);
            game.scene.refresh();
        }
        game.frame();
    };
    tick();
});