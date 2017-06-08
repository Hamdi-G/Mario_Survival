var players;
var updatePlayerNewPos, updatePlayers, updatepos;
  var allPlayers = {};
// Inits
window.onload = function init() {
  var game = new GF();
  game.start();
};

// GAME FRAMEWORK STARTS HERE
var GF = function () {



  // Vars relative to the canvas
  var canvas, ctx, w, h;

  // vars for handling inputs
  var inputStates = {};

  // game states
  var gameStates = {
    mainMenu: 0,
    gameRunning: 1,
    gameOver: 2
  };
  var currentGameState = gameStates.gameRunning;
  var currentLevel = 1;
  var TIME_BETWEEN_LEVELS = 10000; // 5 seconds
  var currentLevelTime = TIME_BETWEEN_LEVELS;
  var sprites;
  var sounds;
  //var player = new Player(10, 10, 50, 50, 100);
  var enemyType = 2;

  // array of enemys to animate
  var enemyArray = [];
  var nbenemys = 5;

  var coinArray = [];
  var nbcoins = 5;

  // Autres joueurs

  updatePlayerNewPos = function updatePlayerNewPos(username_, x, y) {
    allPlayers[username_].x = x;
    allPlayers[username_].y = y;
  }

  // Mise à jour du tableau quand un joueur arrive
  // ou se deconnecte
  updatePlayers = function updatePlayers(listOfPlayers) {
    allPlayers = listOfPlayers;
    for(var name in allPlayers) {
      allPlayers[name] = new Player(10, 10, 50, 50, 100);
    }

  }

  function drawAllPlayers() {
    for(var name in allPlayers) {
      allPlayers[name].draw(ctx, sprites[0]);
    }
  }


  // clears the canvas content
  function clearCanvas() {
    ctx.clearRect(0, 0, w, h);
  }

  var mainLoop = function (time) {

    //main function, called each frame
    measureFPS(time);

    // number of ms since last frame draw
    delta = timer(time);

    // Clear the canvas
    clearCanvas();

    if (allPlayers[username] != undefined) {
      if (allPlayers[username].dead) {
      currentGameState = gameStates.gameOver;
    }
  }


    switch (currentGameState) {
      case gameStates.gameRunning:

      // draw the player
      drawAllPlayers();

      // Check inputs and move the player
      for(var name in allPlayers) {
        allPlayers[name].updatePosition(delta, inputStates);
      }
      // update and draw enemys
      updateEnemys(delta);

      updateCoins(delta);

      // display Score
      displayScore();

      // decrease currentLevelTime.
      // When < 0 go to next level
      currentLevelTime -= delta;

      if (currentLevelTime < 0) {
        goToNextLevel();
      }

      break;
      case gameStates.mainMenu:
      // TO DO !
      break;
      case gameStates.gameOver:
      ctx.fillText("GAME OVER", 300, 200);
      ctx.fillText("Press SPACE to start again", 300, 250);
      ctx.fillText("Move with arrow keys", 300, 300);
      ctx.fillText("Survive 10 seconds for each level", 300, 350);
      if (inputStates.space) {
        startNewGame();
      }
      break;
    }

    // call the animation loop every 1/60th of second
    requestAnimationFrame(mainLoop);
  };

  function startNewGame() {
    sounds[3].play();

    allPlayers[username].dead = false;
    allPlayers[username].coins = 0;

    currentLevelTime = 10000;
    currentLevel = 1;
    nbenemys = 5;
    enemyType = 2;
    createEnemys(nbenemys, currentLevel);
    nbcoins = 5;
    createCoins(nbcoins);
    currentGameState = gameStates.gameRunning;
  }

  function goToNextLevel() {
    sounds[2].play();
    // reset time available for next level
    // 5 seconds in this example
    currentLevelTime = 10000;
    currentLevel++;
    // Add two enemys per level
    nbenemys += 2;
    enemyType++;
    createEnemys(nbenemys, currentLevel);

    nbcoins += 2;
    createCoins(nbcoins);
  }

  function displayScore() {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillText("Level : " + currentLevel, 30, 30);
    ctx.fillText("Time : " + (currentLevelTime / 1000).toFixed(1), 200, 30);
    let enemy = new Ball(400, 25, 0, 0, 25);
    enemy.draw(ctx, sprites[enemyType]);
    ctx.fillText("X " + nbenemys, 420, 30);
    let coin = new Ball (600, 25, 0, 0, 25);
    coin.draw(ctx, sprites[1]);
    if (allPlayers[username] != undefined) {
      ctx.fillText("X " + allPlayers[username].coins, 620, 30);
    }
    ctx.restore();
  }


  function updateEnemys(delta) {
    // Move and draw each enemy, test collisions,
    for (var i = 0; i < enemyArray.length; i++) {
      var enemy = enemyArray[i];

      // 1) move the enemy
      enemy.move();

      // 2) test if the enemy collides with a wall
      testCollisionWithWalls(enemy, w, h);

      // Test if the player collides
      for(var name in allPlayers) {
        if (circRectsOverlap(allPlayers[name].x, allPlayers[name].y,
          allPlayers[name].width, allPlayers[name].height,
          enemy.x, enemy.y, enemy.radius)) {

            //change the color of the enemy
            allPlayers[name].dead = true;
            // Here, a sound effect greatly improves
            // the experience!
            sounds[3].pause();
            sounds[3].currentTime = 0;
            sounds[1].play();
          }
        }

        // 3) draw the enemy
        enemy.draw(ctx, sprites[enemyType] );
      }
    }

    function createEnemys(numberOfEnemys, level) {
      // Start from an empty array
      enemyArray = [];

      for (var i = 0; i < numberOfEnemys; i++) {
        // Create a enemy with random position and speed.
        // You can change the radius
        var enemy = new Ball(w * Math.random(),
        h * Math.random(),
        (2 * Math.PI) * Math.random(),
        (40 * level),
        35 );

        // Do not create a enemy on the player. We augmented the enemy radius
        // to sure the enemy is created far from the player.
        for(var name in allPlayers) {
          if (!circRectsOverlap(allPlayers[name].x, allPlayers[name].y,
            allPlayers[name].width, allPlayers[name].height,
            enemy.x, enemy.y, enemy.radius * 3)) {
              // Add it to the array
              enemyArray[i] = enemy;
            } else {
              i--;
            }

          }
        }
      }


      function updateCoins(delta) {
        // Move and draw each enemy, test collisions,
        for (var i = 0; i < coinArray.length; i++) {
          var coin = coinArray[i];

          // 1) move the coin
          coin.move();

          // 2) test if the coin collides with a wall
          testCollisionWithWalls(coin, w, h);

          // Test if the player collides
          for(var name in allPlayers) {
            if (circRectsOverlap(allPlayers[name].x, allPlayers[name].y,
              allPlayers[name].width, allPlayers[name].height,
              coin.x, coin.y, coin.radius)) {

                coin.disappear();
                allPlayers[name].coins++;

                // Here, a sound effect greatly improves
                // the experience!
                sounds[0].play();
              }
            }

            // 3) draw the coin

            coin.draw(ctx, sprites[1] );

          }
        }

        function createCoins(numberOfCoins) {
          // Start from an empty array
          coinArray = [];

          for (var i = 0; i < numberOfCoins; i++) {
            // Create a coin with random position and speed.
            // You can change the radius
            var coin = new Ball(w * Math.random(),
            h * Math.random(),
            (2 * Math.PI) * Math.random(),
            (80 * Math.random()),
            30);

            // Do not create a coin on the player. We augmented the coin radius
            // to sure the coin is created far from the player.
            for(var name in allPlayers) {
              if (!circRectsOverlap(allPlayers[name].x, allPlayers[name].y,
                allPlayers[name].width, allPlayers[name].height,
                coin.x, coin.y, coin.radius * 3)) {
                  // Add it to the array
                  coinArray[i] = coin;
                } else {
                  i--;
                }
              }
            }
          }
          // constructor function for enemys

          function loadAssets(callback) {
            // here we should load the souds, the sprite sheets etc.
            // then at the end call the callback function

            sounds = new Array();
            sprites = new Array();
            function preload() {
              for (i = 0; i < 11; i++) {
                sprites[i] = new Image();
                sprites[i].src = preload.arguments[i];
              }
              for (i = 0; i < 4; i++) {
                sounds[i] = new Audio();
                sounds[i].src = preload.arguments[i+11];
              }
            }
            preload (
              "./assets/sprite/mario.png",
              "./assets/sprite/coin.png",
              "./assets/sprite/Goomba.png",
              "./assets/sprite/koopa.png",
              "./assets/sprite/boo.png",
              "./assets/sprite/bom.png",
              "./assets/sprite/fish.png",
              "./assets/sprite/skelerex.png",
              "./assets/sprite/kamek.png",
              "./assets/sprite/rock.png",
              "./assets/sprite/monster.png",
              "./assets/sound/smb_coin.wav",
              "./assets/sound/smb_mariodie.wav",
              "./assets/sound/smb_powerup.wav",
              "./assets/sound/theme_song.mp3"
            );
            callback();
          }
          var start = function () {

            initFPSCounter();

            // Canvas, context etc.
            canvas = document.querySelector("#myCanvas");

            // often useful
            w = canvas.width;
            h = canvas.height;

            // important, we will draw with this object
            ctx = canvas.getContext('2d');
            // default police for text
            ctx.font = "20px Arial";
            //add the listener to the main, window object, and update the states
            addListeners(inputStates, canvas);
            // We create tge enemys: try to change the parameter
            createEnemys(nbenemys , currentLevel);

            createCoins(nbcoins);



            loadAssets(function () {
              // all assets (images, sounds) loaded, we can start the animation
              requestAnimationFrame(mainLoop);
            });
            sounds[3].play();
          };

          //our GameFramework returns a public API visible from outside its scope
          return {
            start: start
          };
        };
