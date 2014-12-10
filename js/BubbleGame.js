'use strict';
//code of bubble game starts;
function BubbleGame(){
	this.gameWindow=document.getElementById("game-window");
	var startDisplay;
	var gameOverDisplay;
	var gameOverText;
	var spnRestart;
	var spanStart;
	var spanHighscores;

	var rstflag; //reset flag to check when to update evel
	var levelCount=1;

	var levelText;
	var levelDisplay;
	var scoreText;
	var livesText;
	var scoreboardDisplay;
	var livesDisplay;

	this.player;
	this.bullet;
	var bubbleDiameter=30;
	
	this.bubbles=[];

	this.victory;//funtion that runs when all levels are completed
	this.score=0;
	this.collisionInterval;
	var punchSnd = new Audio("sounds/punch.mp3"); // sound when bubble hits player
	var that=this;
	this.startScreen=function(){
		// start screen background
		startDisplay=document.createElement("div");
		startDisplay.id="game-start";
		startDisplay.style.display="block";
		that.gameWindow.appendChild(startDisplay);

		//start button
		spanStart=document.createElement("span");
		spanStart.className="menu-item";
		spanStart.style.width="218px"
		spanStart.style.position = "absolute";
		spanStart.style.lineHeight="56px";
		spanStart.style.bottom="130px";
		spanStart.style.right = '5px';
		spanStart.innerHTML="Start";
		spanStart.onclick=that.start;
		startDisplay.appendChild(spanStart);

		//highscore button
		spanHighscores=document.createElement("span");
		spanHighscores.className="menu-item";
		spanHighscores.style.width="218px"
		spanHighscores.style.position = "absolute";
		spanHighscores.style.lineHeight="56px";
		spanHighscores.style.bottom="60px";
		spanHighscores.style.right = '5px';
		spanHighscores.innerHTML="High Scores";
		startDisplay.appendChild(spanHighscores);

	}
	// game over screen
	this.gameOverScreen=function (argument){
		gameOverDisplay=document.createElement("div");
		gameOverDisplay.id="game-over";
		gameOverDisplay.style.display="block";
		that.gameWindow.appendChild(gameOverDisplay);

		gameOverText=document.createElement("span");
		gameOverText.id="game-over-text";
		gameOverText.innerHTML="Game Over";
		gameOverDisplay.appendChild(gameOverText);

		spnRestart=document.createElement("span");
		spnRestart.style.display="block";
		spnRestart.innerHTML="Play Again";
		spnRestart.id="play-again";
		spnRestart.lineHeight="58px";
		spnRestart.style.fontSize="40px";
		spnRestart.style.width="218px";
		spnRestart.style.left="280px";
		spnRestart.style.top="160px";
		spnRestart.onclick=that.start;
		gameOverDisplay.appendChild(spnRestart);

	}
	this.statsDisplay=function(){

		// display of lives
		livesText=document.createElement("p");
		livesText.innerHTML="Lives : ";
		livesText.style.color="#fff";
		livesText.style.marginLeft="15px"
		livesText.style.fontSize="32px";
		livesText.style.float="left";
		that.gameWindow.appendChild(livesText);

		livesDisplay=document.createElement("span");
		livesDisplay.innerHTML="3";
		livesText.appendChild(livesDisplay);

		// display current level
		levelText=document.createElement("p");
		levelText.innerHTML="Level : "
		levelText.style.color="green";
		levelText.style.marginLeft="215px";
		levelText.style.fontSize="32px";
		levelText.style.float="left";
		that.gameWindow.appendChild(levelText);

		levelDisplay=document.createElement("span");
		levelDisplay.innerHTML="1";//initial level
		levelText.appendChild(levelDisplay);

		// display of score
		scoreText=document.createElement("p");
		scoreText.innerHTML="Score : ";
		scoreText.style.color="#fff";
		scoreText.style.fontSize="32px";
		scoreText.style.float="right";
		that.gameWindow.appendChild(scoreText);

		scoreboardDisplay=document.createElement("span");
		scoreboardDisplay.innerHTML="0";
		scoreboardDisplay.style.marginRight="15px"
		scoreText.appendChild(scoreboardDisplay);

	}
	this.start=function(){
		if(startDisplay!=null){
			that.gameWindow.removeChild(startDisplay);
		}
		if(gameOverDisplay!=null){
			gameOverDisplay.style.display="none";
		}
		that.statsDisplay();//diplay health and scores

		//game start function
		that.player=new Player(that);//instance of player
		that.player.createPlayer();//creates new player at the start
		
		that.bullet=new Bullet(that);//instance of bullet

		that.bubbleGenerator();//generates bubble for each level

		that.collisionInterval=setInterval(that.collisionCheck,50);
		document.addEventListener('keydown', that.onkeydown, false);
	}
	this.onkeydown=function(event){
		// keyboard keys handler
		if(event.keyCode == 32){//for space key
			that.bullet.fireBullet();
		}
		if(event.keyCode == 37 ){//for left Arrow
			that.player.moveLeft();
		}
		if(event.keyCode == 39){//for Right Arrow
			that.player.moveRight();
		}
	}
	this.bubbleGenerator=function(){
		rstflag=false;
		levelDisplay.innerHTML=levelCount;
		var bubble = new Bubble(that);//instance of bubble
		bubble.createBubble({bubbleClass:"bubble-red",top:"60px",left:"60px",width:bubbleDiameter+"px"});
	
		that.bubbles.push(bubble);//pushing bubble to array
	}
	this.collisionCheck=function (argument){
		//function to check collision with bullet and player

		scoreboardDisplay.innerHTML=that.score;//updates score

		for (var i = 0; i < that.bubbles.length; i++) {

			var currentBubble = that.bubbles[i];
			var currentBounce = currentBubble.bounce;

			if(that.bullet.fired==true){
				if(currentBounce.positionX>(that.bullet.bulletPosX+that.bullet.bulletWidth-that.bubbles[i].bubbleWidth) && currentBounce.positionX<(that.bullet.bulletPosX+that.bullet.bulletWidth)){
						if((currentBounce.positionY+that.bubbles[i].bubbleWidth)>that.bullet.bulletPosY){

							clearInterval(currentBounce.intervalId);//clear bubble update interval
							var newBubbles = currentBubble.splitBubble(i);//split bubble till end

							currentBubble.destroyBubble();

							that.bubbles.splice(i, 1);//remove bubble from array
							that.bullet.destroyBullet();//clears bullet update interval and removes bullet
							
							if (newBubbles.length == 0) {
								
							} else {
								that.bubbles.push(newBubbles[0]);
								that.bubbles.push(newBubbles[1]);
							}

						}
					}
			}
			// collision with player
			if(currentBounce.positionX>(that.player.playerPosX-parseInt(currentBubble.bubbleWidth)) && currentBounce.positionX<(that.player.playerPosX+that.player.playerWidth)){
				if(currentBounce.positionY>(400-(that.player.playerHeight+parseInt(currentBubble.bubbleWidth)))){
					punchSnd.play();
					
					that.reset();
					that.player.lives--;
					// break;
				}
			}
		};
		//level updater
		if(rstflag==false){
			if(that.bubbles.length==0){
				levelCount++;//game play reaches next level
				bubbleDiameter+=10;// increase bubble diameter for next level
				if(bubbleDiameter<=60){
					that.bubbleGenerator();
				}else{
					that.victory(); //game ends here
				}
			}
			
		}
		
	}
	this.victory=function(){
		//game ends in this function
		that.gameWindow.removeChild(startDisplay);
		that.gameWindow.removeChild(gameOverDisplay);
		that.gameWindow.removeChild(scoreText);
		that.gameWindow.removeChild(levelText);
		that.gameWindow.removeChild(livesText);
		clearInterval(that.collisionInterval);
		that.player.removePlayer();
		that.bubbles=[];
		var victoryDisplay=document.createElement("div");
		victoryDisplay.id="victory";
		that.gameWindow.appendChild(victoryDisplay);

	}
	//reset function
	this.reset=function(){
		rstflag=true;
		livesDisplay.innerHTML=that.player.lives-1;//display number of lives
		for (var i = 0; i < that.bubbles.length; i++) {
				//destroy all bubbles in screen
				var currentBubble = that.bubbles[i];
				currentBubble.destroyBubble();
			};	
			// bubbleDiameter-=10;//not next level if reset
		if(that.player.lives>1){
		that.bubbles=[];
		
		that.bubbleGenerator();

		}else{
			that.gameOver();
		}
	}
	//game over function
	this.gameOver=function(){
		that.player.lives=3;
		that.score=0;
		that.gameWindow.removeChild(scoreText);
		that.gameWindow.removeChild(levelText);
		that.gameWindow.removeChild(livesText);
		clearInterval(that.collisionInterval);
		console.log('game over');
		that.player.removePlayer();
		that.gameOverScreen();
		that.bubbles=[];
	}

}
//start of game
var game=new BubbleGame();
game.startScreen();