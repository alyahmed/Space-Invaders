/* This file contains the primary logic for Space Invaders */


function Game() {

    //  Intial conditions.
    this.settings = {
        bombRate: 0.05,
        bombSpeed: 50,
        invaderInitialspeed: 25,
        invaderDropDistance: 20,
        fps: 30,
        rocketspeed: 140,
        rocketMaxFireRate: 2,
        gameWidth: 600,
        gameHeight: 400,
        invaderrows: 5,
        invaderFiles: 10,
        shipSpeed: 120,
        levelDifficultyMultiplier: 0.4,
        pointsPerInvader: 5
    };

    //  Starting state.
    this.lives = 3;
    this.width = 0;
    this.height = 0;
    this.gameBounds = {left: 0, top: 0, right: 0, bottom: 0};
    this.intervalId = 0;
    this.score = 0;
    this.level = 1;

    //  The state stack.
    this.stateStack = [];

    //  Keyboard I/O hash.
    this.pressedKeys = {};
    this.gameCanvas =  null;

}


Game.prototype.initialise = function(gameCanvas) {

    //  Set the game canvas.
    this.gameCanvas = gameCanvas;

    //  Set the game width and height.
    this.width = gameCanvas.width;
    this.height = gameCanvas.height;

    //  Set the state game bounds.
    this.gameBounds = {
        left: gameCanvas.width / 2 - this.settings.gameWidth / 2,
        right: gameCanvas.width / 2 + this.settings.gameWidth / 2,
        top: gameCanvas.height / 2 - this.settings.gameHeight / 2,
        bottom: gameCanvas.height / 2 + this.settings.gameHeight / 2,
    };
};

Game.prototype.moveToState = function(state) {
 
   //  If in a state, leave it.
   if(this.currentState() && this.currentState().leave) {
     this.currentState().leave(game);
     this.stateStack.pop();
   }
   
   //  If there's an enter function for the new state, call it.
   if(state.enter) {
     state.enter(game);
   }
 
   //  Set the current state.
   this.stateStack.pop();
   this.stateStack.push(state);
 };

//  Start the Game.
Game.prototype.start = function() {

    //  Move into the 'welcome' state.
    this.moveToState(new WelcomeState());

    //  Set the game variables.
    this.lives = 3;

    //  Start the game loop.
    var game = this;
    this.intervalId = setInterval(function () { GameLoop(game);}, 1000 / this.settings.fps);

};

//  Returns the current state.
Game.prototype.currentState = function() {
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
};



//  The main loop.
function GameLoop(game) {
    var currentState = game.currentState();
    if(currentState) {

        //  Delta t is the time to update/draw.
        var dt = 1 / game.settings.fps;

        //  Get the drawing context.
        var ctx = this.gameCanvas.getContext("2d");
        
        //  Update if we have an update function. Also draw
        //  if we have a draw function.
        if(currentState.update) {
            currentState.update(game, dt);
        }
        if(currentState.draw) {
            currentState.draw(game, dt, ctx);
        }
    }
}

Game.prototype.pushState = function(state) {

    //  If there's an enter function for the new state, call it.
    if(state.enter) {
        state.enter(game);
    }
    //  Set the current state.
    this.stateStack.push(state);
};

Game.prototype.popState = function() {

    //  Leave and pop the state.
    if(this.currentState()) {
        if(this.currentState().leave) {
            this.currentState().leave(game);
        }

        //  Set the current state.
        this.stateStack.pop();
    }
};

//  The stop function stops the game.
Game.prototype.stop = function Stop() {
    clearInterval(this.intervalId);
};

//  Inform the game a key is down.
Game.prototype.keyDown = function(keyCode) {
    this.pressedKeys[keyCode] = true;
    //  Delegate to the current state too.
    if(this.currentState() && this.currentState().keyDown) {
        this.currentState().keyDown(this, keyCode);
    }
};

//  Inform the game a key is up.
Game.prototype.keyUp = function(keyCode) {
    delete this.pressedKeys[keyCode];
    //  Delegate to the current state too.
    if(this.currentState() && this.currentState().keyUp) {
        this.currentState().keyUp(this, keyCode);
    }
};

//Starting area.
function WelcomeState() {

}
 

WelcomeState.prototype.draw = function(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="30px Audiowide";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center"; 
    ctx.textAlign="center"; 
    ctx.fillText("Space Invaders!", game.width / 2, game.height/2 - 40); 
    ctx.font="16px Audiowide";
    ctx.fillText("Press the space key to start", game.width / 2, game.height/2); 
};

WelcomeState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == 32) /*space*/ {
        //  Space starts the game.
        game.level = 1;
        game.score = 0;
        game.lives = 3;
        game.moveToState(new LevelIntroState(game.level));
    }
};



//End of game, no remaining lives.
function GameOverState() {
    
}

GameOverState.prototype.update = function(game, dt) {

};

GameOverState.prototype.draw = function(game, dt, ctx) {

    //  Empty the background canvas.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="40px Audiowide";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center"; 
    ctx.textAlign="center"; 
    ctx.fillText("Game Over!", game.width / 2, game.height/2 - 40); 
    ctx.font="26px Audiowide";
    ctx.fillText("You scored " + game.score + " and got to level " + game.level, game.width / 2, game.height/2);
    ctx.font="26px Audiowide";
    ctx.fillText("Press 'Space' to GamePlay again.", game.width / 2, game.height/2 + 40);   
};

GameOverState.prototype.keyDown = function(game, keyCode) {
    if(keyCode == 32) {
        //  Space restarts the game.
        game.lives = 3;
        game.score = 0;
        game.level = 1;
        game.moveToState(new LevelIntroState(1));
    }
};

// Handles all in-game logic.
function GamePlayState(settings, level) {
    this.settings = settings;
    this.level = level;

    //  Game state.
    this.invaderCurrentspeed =  10;
    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;
    this.lastRocketTime = null;

    //  Game entities.
    this.ship = null;
    this.invaders = [];
    this.rockets = [];
    this.bombs = [];
}

GamePlayState.prototype.enter = function(game) {

    //  Create the ship.
    this.ship = new Ship(game.width / 2, game.gameBounds.bottom);

    //  Setup initial state.
    this.invaderCurrentspeed =  10;
    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;

    //  Set the ship speed for this level, as well as invader params.
    var difficultyLevel = this.level * this.settings.levelDifficultyMultiplier;
    this.shipSpeed = this.settings.shipSpeed;
    this.invaderInitialspeed = this.settings.invaderInitialspeed + (difficultyLevel * this.settings.invaderInitialspeed);
    this.bombRate = this.settings.bombRate + (difficultyLevel * this.settings.bombRate);
    this.bombSpeed = this.settings.bombSpeed;
    //  Create the invaders.
    var rows = this.settings.invaderrows;
    var files = this.settings.invaderFiles;
    var invaders = [];
    for(var row = 0; row < rows; row++){
        for(var file = 0; file < files; file++) {
            invaders.push(new Invader(
                (game.width / 2) + ((files/2 - file) * 200 / files),
                (game.gameBounds.top + row * 20),
                row, file, 'Invader'));
        }
    }
    this.invaders = invaders;
    this.invaderCurrentspeed = this.invaderInitialspeed;
    this.invaderspeed = {x: -this.invaderInitialspeed, y:0};
    this.invaderNextspeed = null;
};

GamePlayState.prototype.update = function(game, dt) {
    
    
    if(game.pressedKeys[37]) { //Left arrow pressed.
        this.ship.x -= this.shipSpeed * dt;
    }
    if(game.pressedKeys[39]) { //Right arrow pressed.
        this.ship.x += this.shipSpeed * dt;
    }
    if(game.pressedKeys[32]) { //Space key Pressed.
        this.fireRocket();
    }

    //  Keep the ship in bounds.
    if(this.ship.x < game.gameBounds.left) {
        this.ship.x = game.gameBounds.left;
    }
    if(this.ship.x > game.gameBounds.right) {
        this.ship.x = game.gameBounds.right;
    }

    //  Move each bomb.
    for(var i=0; i<this.bombs.length; i++) {
        var bomb = this.bombs[i];
        bomb.y += dt * bomb.speed;

        //  If the rocket has gone off the screen remove it.
        if(bomb.y > this.height) {
            this.bombs.splice(i--, 1);
        }
    }

    //  Move each rocket.
    for(i=0; i<this.rockets.length; i++) {
        var rocket = this.rockets[i];
        rocket.y -= dt * rocket.speed;

        //  If the rocket has gone off the screen remove it.
        if(rocket.y < 0) {
            this.rockets.splice(i--, 1);
        }
    }

    //  Reposition the invaders.
    var hitLeft = false, hitRight = false, hitBottom = false;
    for(i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        var newx = invader.x + this.invaderspeed.x * dt;
        var newy = invader.y + this.invaderspeed.y * dt;
        if(hitLeft == false && newx < game.gameBounds.left) {
            hitLeft = true;
        }
        else if(hitRight == false && newx > game.gameBounds.right) {
            hitRight = true;
        }
        else if(hitBottom == false && newy > game.gameBounds.bottom) {
            hitBottom = true;
        }

        if(!hitLeft && !hitRight && !hitBottom) {
            invader.x = newx;
            invader.y = newy;
        }
    }

    //  Update invader velocities.
    if(this.invadersAreDropping) {
        this.invaderCurrentDropDistance += this.invaderspeed.y * dt;
        if(this.invaderCurrentDropDistance >= this.settings.invaderDropDistance) {
            this.invadersAreDropping = false;
            this.invaderspeed = this.invaderNextspeed;
            this.invaderCurrentDropDistance = 0;
        }
    }
    //  If we've hit the left, move down then right.
    if(hitLeft) {
        this.invaderspeed = {x: 0, y:this.invaderCurrentspeed };
        this.invadersAreDropping = true;
        this.invaderNextspeed = {x: this.invaderCurrentspeed , y:0};
    }
    //  If we've hit the right, move down then left.
    if(hitRight) {
        this.invaderspeed = {x: 0, y:this.invaderCurrentspeed };
        this.invadersAreDropping = true;
        this.invaderNextspeed = {x: -this.invaderCurrentspeed , y:0};
    }
    //  If we've hit the bottom, it's game over.
    if(hitBottom) {
        this.lives = 0;
    }
    
    //  Check for rocket/invader collisions.
    for(i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        var hit = false;

        for(var j=0; j<this.rockets.length; j++){
            var rocket = this.rockets[j];

            if(rocket.x >= (invader.x - invader.width/2) && rocket.x <= (invader.x + invader.width/2) &&
                rocket.y >= (invader.y - invader.height/2) && rocket.y <= (invader.y + invader.height/2)) {
                
                //  Remove the rocket, set 'hit' so we don't process
                //  this rocket again.
                this.rockets.splice(j--, 1);
                hit = true;
                game.score += this.settings.pointsPerInvader;
                break;
            }
        }
        if(hit) {
            this.invaders.splice(i--, 1);
        }
    }

    //  Find all of the front row invaders.
    var frontrowInvaders = {};
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];

        if(!frontrowInvaders[invader.file] || frontrowInvaders[invader.file].row < invader.row) {
            frontrowInvaders[invader.file] = invader;
        }
    }

    //  Give each front row invader a chance to drop a bomb.
    for(var i=0; i<this.settings.invaderFiles; i++) {
        var invader = frontrowInvaders[i];
        if(!invader) continue;
        var chance = this.bombRate * dt;
        if(chance > Math.random()) {
            this.bombs.push(new Bomb(invader.x, invader.y + invader.height / 2, 
                this.bombSpeed));
        }
    }

    //  Bomb/ship collisions.
    for(var i=0; i<this.bombs.length; i++) {
        var bomb = this.bombs[i];
        /* Check to Left and right limit of ship, then the top and bottom.*/
        if(bomb.x >= (this.ship.x - this.ship.width/2 + 10) && bomb.x <= (this.ship.x + this.ship.width/2 + 27) &&
                bomb.y >= (this.ship.y - this.ship.height/2) && bomb.y <= (this.ship.y + this.ship.height/2)) { 
            this.bombs.splice(i--, 1);
            game.lives--;
        }
    }

    //  Invader/ship collisions.
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        if((invader.x + invader.width/2) > (this.ship.x - this.ship.width/2) && 
            (invader.x - invader.width/2) < (this.ship.x + this.ship.width/2) &&
            (invader.y + invader.height/2) > (this.ship.y - this.ship.height/2) &&
            (invader.y - invader.height/2) < (this.ship.y + this.ship.height/2)) {
            //  Dead by collision!
            game.lives = 0;
        }
    }

    //  Check for failure
    if(game.lives <= 0) {
        game.moveToState(new GameOverState());
    }

    //  Check for victory
    if(this.invaders.length === 0) {
        game.score += this.level * 50;
        game.level += 1;
        game.moveToState(new LevelIntroState(game.level));
    }
};

GamePlayState.prototype.draw = function(game, dt, ctx) {
    //  Empty the background.
    ctx.clearRect(0, 0, game.width, game.height);
    
    //  Draw space ship.
    var shipImage = document.getElementById("spaceship");
    ctx.drawImage(shipImage, this.ship.x, this.ship.y, this.ship.width , this.ship.height);
 
    // Draw bombs.
    bombImage = document.getElementById("bomb");
    for(var i=0; i<this.bombs.length; i++) {
        var bom = this.bombs[i];
        ctx.drawImage(bombImage, bom.x - 2, bom.y, 8, 8);
    }

    //  Draw invader ships.
    invaderImage = document.getElementById("invader");

    for(var i=0; i<this.invaders.length;i++){
        var invar = this.invaders[i];
        ctx.drawImage(invaderImage, invar.x, invar.y, invar.width, invar.height);
    }


    //  Draw rockets.
    rocketImage = document.getElementById('rocket');

    for(var i=0; i<this.rockets.length; i++) {
        var rock = this.rockets[i];
        ctx.drawImage(rocketImage, rock.x, rock.y - 2, 10 , 20);
        // ctx.fillRect(rocket.x, rocket.y - 2, 1, 4);
    }

    //  DisGamePlay information
    var textYpos = game.gameBounds.top - ((game.height - game.gameBounds.bottom) / 2) + 14/2;
    ctx.font="20px Audiowide";
    ctx.fillStyle = '#ffffff';
    var info = "No. of Lives: " + game.lives;
    ctx.textAlign = "right";
    ctx.fillText(info, game.gameBounds.right, textYpos);
    info = "Score: " + game.score + ", Level: " + game.level;
    ctx.textAlign = "left";
    ctx.fillText(info, game.gameBounds.left, textYpos);

};

GamePlayState.prototype.keyDown = function(game, keyCode) {

    if(keyCode == 32) {
        //  Fire!
        this.fireRocket();
    }
};

GamePlayState.prototype.keyUp = function(game, keyCode) {

};

GamePlayState.prototype.fireRocket = function() {
    //  If no last rocket time, or the last rocket time 
    //  is older than the max rocket rate, can fire.
    if(this.lastRocketTime === null || ((new Date()).valueOf() - this.lastRocketTime) > (1000 / this.settings.rocketMaxFireRate))
    {   

        this.rockets.push(new Rocket(this.ship.x + 20, this.ship.y - 12, this.settings.rocketspeed)); //Fire rocket.
        this.lastRocketTime = (new Date()).valueOf();
    }
};

    //Level Intro State
function LevelIntroState(level) {
    this.level = level;
    this.countdownMessage = "3";
}

LevelIntroState.prototype.update = function(game, dt) {

    //  Update the countdown.
    if(this.countdown === undefined) {
        this.countdown = 3; // countdown from 3 secs
    }
    this.countdown -= dt;

    if(this.countdown < 2) { 
        this.countdownMessage = "2"; 
    }
    if(this.countdown < 1) { 
        this.countdownMessage = "1"; 
    } 
    if(this.countdown <= 0) {
        //  Move to the next level, popping this state.
        game.moveToState(new GamePlayState(game.settings, this.level));
    }

};
//Start state
LevelIntroState.prototype.draw = function(game, dt, ctx) {

    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font="36px Audiowide"; //Custom font.
    ctx.fillStyle = '#ffffff'; 
    ctx.textBaseline="middle"; 
    ctx.textAlign="center";
    if (this.countdownMessage >= 1){
        ctx.fillText("Level " + this.level, game.width / 2, game.height/2);
        ctx.font="30px Audiowide";
        ctx.fillText("Starting in... " + this.countdownMessage, game.width / 2, game.height/2 + 36);
        return;
    }
    if (this.countdownMessage == 0){
       ctx.fillText("Go!"); 
       return;
    }
    
};

