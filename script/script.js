define(['lib/gl-matrix', 'jquery'], function (glMatrix, $) {
    "use strict";
    var gl;
    var mvMatrix = glMatrix.mat4.create();
    var pMatrix = glMatrix.mat4.create();

    var rotation = 0;

    function tick() {
        window.requestAnimationFrame(tick);

        drawScene();
        animate();
    }

    var lastTime = 0;
    var speed = 50;

    function animate() {
        if (lastTime === 0) {
            lastTime = new Date().getTime();
        }

        var newTime = new Date().getTime();
        var delta = newTime - lastTime;
        rotation = (rotation + delta / 1000.0 * speed * Math.PI / 180);

        lastTime = newTime;
    }

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            window.alert("Could not initialise WebGL, sorry :-( ");
        }
    }

    var square;
    var squareColor;

    function initBuffers() {
        square = gl.createBuffer();

        var size = 1;
        var squareArray = [
            size, size, 0.0,
            -size, size, 0.0,
            size, -size, 0.0,
            -size, -size, 0.0
        ];

        gl.bindBuffer(gl.ARRAY_BUFFER, square);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareArray), gl.STATIC_DRAW);

        square.size = 4;
        square.vectorSize = 3;

        squareColor = gl.createBuffer();

        var squareColorArray = [
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1,
            1, 1, 1, 1
        ];

        gl.bindBuffer(gl.ARRAY_BUFFER, squareColor);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareColorArray), gl.STATIC_DRAW);

        squareColor.size = 4;
        squareColor.vectorSize = 4;
    }

    var shaderProgram;

    function initShaders() {
        var fragmentShader = getShader(gl, "frag", "fragment");
        var vertexShader = getShader(gl, "vert", "vertex");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            window.alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    }

    var avgProgram = 0;
    var nProgram = 0;

    function drawScene() {
        /* jshint bitwise: false */
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        glMatrix.mat4.perspective(pMatrix, Math.PI / 180 * 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);


        glMatrix.mat4.identity(mvMatrix);

        glMatrix.mat4.translate(mvMatrix, mvMatrix, [0, 0, -7]);
        glMatrix.mat4.rotate(mvMatrix, mvMatrix, rotation, [Math.PI / 180, Math.PI / 90, Math.PI / 45]);

        var time = new Date();
        gl.useProgram(shaderProgram);
        var newTime = new Date();
        var delta = newTime.getTime() - time.getTime();
        avgProgram = (avgProgram * nProgram + delta) / (nProgram + 1);
        nProgram += 1;
        $("#program").text(avgProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, square);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, square.vectorSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, squareColor);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareColor.vectorSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, square.size);
    }

    function getShader(gl, name, type) {
        var source = "";

        $.ajax({
            url: "shaders/" + name + ".glsl",
            async: false,
            type: "GET",
            dataType: "text"
        }).done(function (data) {
            source = data;
        }).error(function () {
            window.alert("Invalid shader name.");
        });

        var shader;

        if (type === "fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (type === "vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        }

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            window.alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    var avgMatrix = 0;
    var nMatrix = 0;

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        var time = new Date();
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        var newTime = new Date();
        var delta = newTime.getTime() - time.getTime();
        avgMatrix = (avgMatrix * nMatrix + delta) / ( nMatrix + 1);
        nMatrix += 1;
        $("#matrix").text(avgMatrix);
    }

    return function webGLStart() {
        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initGL(canvas);
        initShaders();
        initBuffers();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        tick();
    };
});