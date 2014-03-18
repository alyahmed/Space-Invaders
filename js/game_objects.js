/* -------------------------------- GAME OBJECTS ---------------------------- */

function Rocket(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
}

function Ship(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 54;
}


function Bomb(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
}
 
function Invader(x, y, rank, file, type) {
    this.x = x;
    this.y = y;
    this.rank = rank;
    this.file = file;
    this.type = type;
    this.width = 20;
    this.height = 30;
}

// Used in background.js.
function Asteroid(x, y, size, velocity) {
    this.x = x;
    this.y = y;
    this.size = size*(Math.random()*3);
    this.velocity = velocity;
}

