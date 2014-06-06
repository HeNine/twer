library twer;

import 'dart:html';

import 'package:Twer/game.dart';

Game game;

DateTime time;

void tick([num hiResTime]) {
  DateTime newTime = new DateTime.now();
  num delta = newTime.millisecondsSinceEpoch - time.millisecondsSinceEpoch;
  time = newTime;

  game.rotation = (game.rotation + (delta / 1000)) % (360 * 3);

  game.scene.refresh();
  game.scene.render();

  window.requestAnimationFrame(tick);
}

void main() {
  game = new Game();
  time = new DateTime.now();

  tick(0);
}