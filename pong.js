var gameState = 'PAUSED'; //PAUSED, PLAY, GAMEOVER
var maxSpeed = 4;
var playerWon = 0;
var osc;
var osc2;
var pointSound;
var playing1 = false;
var playing = false;
var timing;
var timing1;

var puck = {
  x: 200,
  y: 200,
  xSpeed: 4,
  ySpeed: -4,
  r: 10
};
var edgeOffset = 20;

var player1 = {
  x: edgeOffset,
  y: 200,
  ht: 50,
  wd: 10
};

var player2 = {
  x: 400-edgeOffset,
  y: 200,
  ht: 50,
  wd: 10
};

var score1 = {
	x: 30,
	y: 30,
	v: 0,
};

var score2 = {
	x: 400-50,
	y: 30,
	v: 0,
};


function setup() {
  createCanvas(400, 400);
	
	
	osc = new p5.Oscillator();
  osc.setType('triangle');
  osc.freq(500);
  osc.amp(0);
  osc.start();
	
	osc2 = new p5.Oscillator();
  osc2.setType('triangle');
  osc2.freq(1000);
  osc2.amp(0);
  osc2.start();
}

function playSound(){
	
	if(playing == false){
		timing = millis();
		osc.amp(0);
	}
	if(timing-millis() > 500 || playing == true){
		osc.amp(0.5);
		playing = false;
	}
	
	if(playing1 == false){
		timing1 = millis();
		osc2.amp(0);
	}
	if(timing1-millis() > 500 || playing1 == true){
		osc2.amp(0.5);
		playing1 = false;
	}
	
}

function movePuck(){
  // move puck
  if (puck.y < puck.r || puck.y > height - puck.r) {
			if(puck.xSpeed < 0){
				maxSpeed -= 0.1;
				puck.xSpeed -= 0.1;
				puck.ySpeed = -puck.ySpeed - 0.1;
				playing = true;
			} else {
				maxSpeed += 0.1;
				puck.xSpeed += 0.1;
				puck.ySpeed = -puck.ySpeed + 0.1;
				playing = true;
			}
  }
	if(puck.x < 0){
		//print("dead");
		playing1 = true;
		puck.x = width/2;
		puck.y = height/2;
		puck.ySpeed = 0;
		puck.xSpeed = 4;
		score2.v += 1;
	} else if(puck.x > width){
		playing1 = true;
		puck.x = width/2;
		puck.y = height/2;
		puck.ySpeed = 0;
		puck.xSpeed = -4;
		score1.v += 1;		
						
	}
  
  puck.x += puck.xSpeed;
  puck.y += puck.ySpeed;	
}

function paddles(){
	  // draw paddles
	fill(255, 255, 255);
  rect(player1.x, player1.y, player1.wd, player1.ht);
  rect(player2.x-player2.wd, player2.y, player2.wd, player2.ht);
  
  // paddle movement
  if (player1.paddleDown && ! player1.paddleUp) {
    player1.y += 10;
  }
  if (player1.paddleUp && ! player1.paddleDown) {
    player1.y -= 10;
  } 

  if (player2.paddleDown && ! player2.paddleUp) {
    player2.y += 10;
  }
  if (player2.paddleUp && ! player2.paddleDown) {
    player2.y -= 10;
  }
  
  // don't let paddles outside of the play area
  player1.y = constrain(player1.y, 0, height-player1.ht-1);
  player2.y = constrain(player2.y, 0, height-player2.ht-1);
	
	 if (puck.x + puck.r > player2.x - player2.wd) {
    // check if puck is within paddle height...
    if (puck.y > player2.y && puck.y < player2.y + player2.ht) {
			if(puck.xSpeed < 0){
				maxSpeed -= 0.1;
				puck.xSpeed -= 0.1;
			} else {
				maxSpeed += 0.1;
				puck.xSpeed += 0.1;
			}
      puck.xSpeed = -abs(puck.xSpeed);
			puck.ySpeed = map(puck.y - (player2.y + player2.ht/2),-12,12,-maxSpeed,maxSpeed);
			playing = true;
    } else {
      // ???
    }
  }
	
	  if (puck.x - puck.r < player1.x + player1.wd) {
    // check if puck is within paddle height...
    if (puck.y > player1.y && puck.y < player1.y + player1.ht) {
						if(puck.xSpeed < 0){
				maxSpeed -= 0.1;
				puck.xSpeed -= 0.1;
			} else {
				maxSpeed += 0.1;
				puck.xSpeed += 0.1;
			}
      puck.xSpeed = abs(puck.xSpeed);
			puck.ySpeed = map(puck.y - (player1.y + player1.ht/2),-12,12,-maxSpeed/2,maxSpeed/2);
			playing = true;
    } else {
      // ???
    }
  }

	
}

function printScore(){	
	textSize(32);
	fill(150, 150, 150);
	text(score1.v, score1.x, score1.y);
	text(score2.v, score2.x, score2.y);
}

function draw() {
  background(0);
	
	if(gameState == 'PAUSED'){
		fill(255,255,255);
		textSize(40);
		text("Click To Play", width/5, height/4, (width/4)*3, (height/4)*3);
		if(mouseIsPressed == true){
			 gameState = 'PLAY';
		}
	}
	if(gameState == 'PLAY'){
				// draw puck
		fill(200,200,255);
		playSound();
		ellipse(puck.x, puck.y, puck.r*2);
		stroke(255);
		line(width/2,0,width/2,height);
		noStroke();
		movePuck();
		paddles();
		printScore();
		if(score1.v == 5 || score2.v == 5){
			if(score1.v < score2.v){
				gameState = 'GAMEOVER';	
				playerWon = 1;
			} else{
				gameState = 'GAMEOVER';	
				playerWon = 2;
			}
		}
	}
	if(gameState == 'GAMEOVER'){
		fill(255,255,255);
		textSize(40);
		text("Player " + playerWon + " Wins", width/5, height/4, (width/4)*3, height/2);
		text("Click to play again", width/5, height/2, (width/4)*3, height/2);
		if(mouseIsPressed == true){
			gameState = 'PLAY';
			playerWon = 0;
			score1.v = 0;
			score2.v = 0;
		}
	}

}

// keyboard input
function keyPressed() {
  print(key);
  if (key == 'S') {
    player1.paddleDown = true;
  } else if (key == 'W') {
    player1.paddleUp = true;
  }
  
  if (keyCode == DOWN_ARROW) {
    player2.paddleDown = true;
  } else if (keyCode == UP_ARROW) {
    player2.paddleUp = true;
  }
}

function keyReleased() {
  if (key == 'S') {
    player1.paddleDown = false;
  } else if (key == 'W') {
    player1.paddleUp = false;
  }
  
  if (keyCode == DOWN_ARROW) {
    player2.paddleDown = false;
  } else if (keyCode == UP_ARROW) {
    player2.paddleUp = false;
  }
}
