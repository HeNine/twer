library game;

import 'dart:html';
import 'dart:web_gl' as gl;

import 'package:vector_math/vector_math.dart';

import 'package:Twer/resource_management/resource_management.dart';
import 'package:Twer/scene_graph/scene_graph.dart';

class Game {
  CanvasElement canvas;

  gl.RenderingContext context;

  ResourceManager resourceManager;
  Scene scene;

  double rotation = 0.0;

  Game() {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.context = canvas.getContext3d();

    this.resourceManager = new ResourceManager(this.context);
    this.scene = new Scene(this.resourceManager, this.context,
    this.canvas.width, this.canvas.height);

    Model model = this.resourceManager.getResource(ResourceManager.MODEL,
    resourceURL:'models/krejt.json');

    TransformNode move = new TransformNode((
        Matrix4 matrix) => matrix.translate(0.0, 0.0, 0.0));
    this.scene.root.append(move);

    TransformNode rotate = new TransformNode((
        Matrix4 matrix) => matrix.rotate(new Vector3(1.0, 2.0, 3.0),
    this.rotation));
    move.append(rotate);

    rotate.append(new ObjectNode(model));

    this.scene.camera.moveTo(new Vector3(0.0, 0.0, 7.0));

    this.scene.refresh();
  }
}