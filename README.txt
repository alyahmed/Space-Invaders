--------------------------------------------------
--------------------------------------------------
||		Space Invaders			||
--------------------------------------------------
--------------------------------------------------
		-------------------------
		|	Controls:	|
		-------------------------
Use left-arrow key to move left, right-arrow key to move right, 
and spacebar to shoot.

      	     ------------------------------------	
	     |	       Game Instructions:	|
	     ------------------------------------
1) Open the index.html file in the ~/Space Invaders
2) Press spacebar to start the game
3) Use game controls to play the game to destroy all of the alien ships for each level. 
 
	       ----------------------------------
	       |	Development Design:	|
               ----------------------------------
~/index.html
	main interface that contains basic html layout
~/js/background.js
	contains functions that draw lateral moving stars in the main website
~/js/game.js
	contains core game mechanics such as spaceship and alien movements,
	shooting algorithms, collision mechanics, game settings 
	(default difficulty incrementer, lives, points, speed definitions)
~/js/game_objects.js
	Contains all the core game objects used in the game. 
	Includes the rocket, ship, invader, bomb and asteroid objects.
~/js/start.js
	initializer file that starts the drawing process of game sprites 
	and the game itself
~/css/normalize.css
	Enables the screen to fit dynamically to different screen resolutions
~/css/settings.css
	Default dimension setting for the game canvas and screen.
~/css/style.css
	Basic style setup for the game.

These separation of js to background, game and start allows the developers to control 
the three major aspect of games: moving background, game play phase, and game start phase
This particular separation allows decrease in debugging time by addressing the bugs in
the game at different stages

The separation of css files is also similiarly reasoned as js as the general font styles,
frame sizes, and screen sizes are divided into separate files.

The index.html only contains the skeletal aspect of the game that loads the js and css.

		---------------------------------
		|	Data Structure:				 |
		---------------------------------
- The game utilizes arrays to store data.
- The bomb object holds the x,y positions and speed of each bomb dropped by an invader. 
- The asteroid object holds the x/y positions, size and velocity of the background asteroids.
- The invader object holds the x/y positions, rank (row position), file and type variables.
- The rocket object holds the x/y positions and the speed of each rocket.
- The ship object holds the x/y positions and size of the space ship.

           ----------------------
		   |	 Known Bugs:	|
           ----------------------
-None

		 ---------------------------------
		|	Missing Features:			 |
		 ---------------------------------
-None
