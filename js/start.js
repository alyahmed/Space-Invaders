/* Generates background and game 
   content by calling game.js and background.js.
   The background is placed in a seperate canvas than the game.

*/


//  Create the background stars.
var container = document.getElementById('background');
container.width = 800;
container.height = 500;
var background = new Background();
background.initialise(container);
background.start();

//  Setup the canvas.
var canvas = document.getElementById("gameCanvas");

canvas.width = 800;
canvas.height = 500;

//  Create the game.
var game = new Game();

//  Initialise it with the game canvas
game.initialise(canvas);

//  Start the game.
game.start();

//Keyboard event listeners

//  Listen for keyboard events.
window.addEventListener("keydown", function keydown(e) {

var keycode = e.which || window.event.keycode;
//  Supress further processing of left/right/space (37/29/32)
  if(keycode == 37 || keycode == 39 || keycode == 32) {
      e.preventDefault();
  }
  game.keyDown(keycode);
});

window.addEventListener("keyup", function keydown(e) {
  var keycode = e.which || window.event.keycode;
  game.keyUp(keycode);
});
