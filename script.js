/*global bckgrnd, keycode, bckgrnd2, collideRectRect, cloudX, loadFont, makeHitBox, textFont, noFill, cloudName, cloud, clouds, cloudY, classifier, random, label, classifyAudio, cloudsArr, cloud1, cloud2, cloud3, createCanvas, loadJSON, Sprite, image,loadImage, myButton, Clickable, collideRectCircle, Clickable, random, noStroke, noLoop, rect, gameIsOver, keyPressed, text, textSize, background, dino, width, height, Dino, height, fill, ellipse, frameCount, keyCode, Obstacle, voiceRec, ml5, p5, round*/

console.log('ml5 version:', ml5.version);

var mic;
var time = 0;
var obs = [];
var useVol, vol;
let lives, score;
let label;

let spritesheet;
let spritedata;
let animation = [];
let kirby = [];
let clouds = [];
let scores = [];
let myFont;
let highScore = 0;

function preload() {
  spritedata = loadJSON('kirby.json');
  spritesheet = loadImage('https://cdn.glitch.com/8c2bbf5f-11ce-4d8e-b3c5-a6f009fdf7fc%2Fkirby%20sprite.png?v=1595966571962');
  bckgrnd = loadImage('https://cdn.glitch.com/8c2bbf5f-11ce-4d8e-b3c5-a6f009fdf7fc%2Fkirby%20bckgr.png?v=1596010713032');
  //bckground image variation
  bckgrnd2 = loadImage('https://cdn.glitch.com/8c2bbf5f-11ce-4d8e-b3c5-a6f009fdf7fc%2Fgoogle-cacti.png?v=1595969030687');
  cloud1 = loadImage('https://cdn.glitch.com/8c2bbf5f-11ce-4d8e-b3c5-a6f009fdf7fc%2Fcloud1.png?v=1596011369929');
  cloud2 = loadImage('https://cdn.glitch.com/8c2bbf5f-11ce-4d8e-b3c5-a6f009fdf7fc%2Fcloud2.png?v=1596011597798');
  cloud3 = loadImage('https://cdn.glitch.com/8c2bbf5f-11ce-4d8e-b3c5-a6f009fdf7fc%2Fcloud3.png?v=1596011816321');
  // clouds.push(cloud1);
  // clouds.push(cloud2);
  // clouds.push(cloud3);
  myFont = loadFont('https://cdn.glitch.com/054d4ed2-4c4f-4523-aa35-6eba158ffd3f%2Fjoystix%20monospace.ttf?v=1596079191596');
  classifier = ml5.soundClassifier('https://teachablemachine.withgoogle.com/models/7xiO-2LgN/')
  
}


function setup() {
  createCanvas(600, 600);
  //let bckgrndIMAGE = bckgrnd?

  // obs.push(new Obstacle());
  classifyAudio();
  // classifier.classify(gotResults);
  
 
  gameIsOver = false;
  score = 0;
  lives = 3;
  //new p5 audio in object
  mic = new p5.AudioIn();
  //start listening
  mic.start();
  
  
  //kirby stuff
  
  let frames = spritedata.frames;
  for(let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    animation.push(img);
  }
  
  // for (let i = 0; i < clouds.length; i++){
  //  let cloudName = clouds[i];
  // }
    // creates clouds
  for (let i = 0; i < 3; i++) {
    let cloud = new Cloud();
    // clouds[i] = cloud;
    clouds.push(cloud);
    
  }
  
  //cloud 
  //.cloudBoxX
   dino = new Kirby();

}



function draw() {
  background(160);
  
  
  
  //change background when google cssi is said
  let bckgrndIMAGE = bckgrnd;
  if (label ==  'Google CSSI'){
    // bckgrndIMAGE = background image variation;
    bckgrndIMAGE = bckgrnd2;
    console.log("NERDY")
    
  }
  else if(label == 'Kirby'){
    bckgrndIMAGE = bckgrnd;
    console.log("KIIRBSTERS")

  }
  
  else{
    bckgrndIMAGE = bckgrnd;
  }
  console.log(label);
  image(bckgrndIMAGE, 0, 0);
  
  // gotResults();
  // easterEgg();

  

 for(let cloud of clouds) {
    // fill('white')
   console.log(cloud.cloudBoxX);
    cloud.show();
    cloud.move();
   cloud.makeHitBox();
  }
  
  //getting value of the volume level
  vol = mic.getLevel()*100;
  // var useVol = vol*100;
  useVol = -1*(vol.toFixed(2));


  
  dino.show();
  dino.makeHitBox();

  dino.update();
  dino.checkCollision(clouds);

  // score, lives, and time functions
  displayScores();
  handleTime();
  // voiceRec();
 
  /*
  if (gameIsOver == true) {
     myButton = new Clickable();     
     myButton.locate(width/2, height/2);
     myButton.textFont(myFont);
     myButton.text = "Play Again";
     myButton.onPress = playAgain()
     myButton.draw();
  } */
  
  if (gameIsOver ==true){
    textSize(50);
    text('Game Over', 110, height/2 - 100);
    textSize(25);
    text('Click SPACEBAR to Restart', 45, height/2)
  }
  
  
  //restart game functions
  // restart();
}

function classifyAudio(){
  classifier.classify(gotResults);
}
  
function gotResults(error, results){
  if(error){
    console.error(error);
    return
  }
 label = results[0].label;
}


function displayScores() {
  textFont(myFont);
  textSize(18);
  fill(0);
  text(`Lives: ${lives}`, 10, height-30);
  text(`Score: ${score}`, 10, height-10);
}



class Kirby{
    constructor() {
      this.x = 64;
      this.y = height/2;
      this.gravity = 0.3;
      this.lift = -15;
      this.velocity = 0;
      // this.lives = 3;
    }
  
    show() {

      noStroke();
      let kirbImage = image(animation[0],this.x,this.y);
      //if word is said, show different image
       //if (label == 'Google CSSI'){
         //image(dinopic, this.x, this.y);
       //}
      /*if statement{
        hide function to hide kirbImage
        image(picture of dino);
      }*/

    }
    makeHitBox() {
      noFill();
      // fill("white");
      let kirbBox = rect(this.x, this.y, 50,52);

    }
    up() {
    this.velocity += this.lift;
    }    
    update() {
      this.velocity += this.gravity;
      this.velocity *= 0.9;
      //BIRDIE FLIES W VOICE
      this.y += (this.velocity + (useVol*2));
      // console.log(this.y);
      
      if (this.y > height-200) {
        this.y = height-200;
        this.velocity = 0;
        lives = 0;
        gameIsOver = true;
      }
      else if (this.y < 0) {
        this.y = 0;
        this.velocity = 0;
      }
      
      if (gameIsOver == true) {
        this.y = 0;
        this.velocity = 0;
      }
    }
  
    checkCollision(clouds) {
      //collideRectRect(x1, y1, w1, h1, x2, y2, w2, h2);
      for(let cloud of clouds){
          let hit = collideRectRect(this.x, this.y, 50, 52, cloud.x-40, cloud.y-35, 87,68 );
          console.log(hit)
          
          if(hit&&lives > 0){
            //find a way to remove specific cloud in the array
            cloud.x = width + 40;
            cloud.y = random(0,400);
            cloud.speed = random(1,3);
            lives-= 1;   
            // this.y = cloud.y-60;
          }
          else if(lives == 0){
            gameOver();
          }
      }
    }
    
}



class Cloud
  {
    constructor()
    {
      this.x = random(width);
      this.y = random(height-200);
      this.speed = random(1, 3);
      //hitboxrect positioons
      this.cloudBoxX = this.x-40;
      this.cloudBoxY = this.y-35;
      
    }
    show()
    {
      //ellipse(x, y, w, [h])
      noStroke();
      fill('white');
      
      ellipse(this.x, this.y, 60, 40);
      ellipse(this.x, this.y - 20, 40, 30);
      ellipse(this.x, this.y + 20, 35, 25);
      ellipse(this.x + 23, this.y, 40, 30);
      ellipse(this.x + 20, this.y - 15, 30, 20);
      ellipse(this.x - 20, this.y + 15, 30, 20);
      ellipse(this.x - 20, this.y - 5, 40, 30);
      ellipse(this.x + 20, this.y + 15, 30, 20);
      

    }
    makeHitBox() {
      noFill();
      let cloudBox = rect(this.cloudBoxX, this.cloudBoxY, 87,68);
    }
    move()
    {
    this.x -= this.speed;
      //resets the cloud 
    if(this.x < -40)
      {
        //wiidth + half width of cloud
        this.x = width + 40;
        
        this.y = random(0,400);
        this.speed = random(1,3);
      }
      
      if (gameIsOver == true) {
        this.x = 0;
      }
    }  
    
  }

 function gameOver() {
 
    gameIsOver = true;
    lives = 0;
      
 
} 

function handleTime() {
  // We'll write code to handle the time.
  if (lives > 0){
    time++;
    score = round(time/10, 2);
  } 
  else {
    time = 0;
  }
}


function keyPressed(){
  if (gameIsOver == true){
     if (keyCode == 32){
       playAgain();
     } else {
       noLoop();
     }
  }
}

function playAgain() {
  window.location.reload(false);
}

