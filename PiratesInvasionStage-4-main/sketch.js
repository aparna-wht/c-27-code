const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon, boat;
var balls = [];
var boats = [];

var boatAnimation = [];
var boatSpritedata,boatSpriteSheet;

var boatFrames,brokenBoatFrames;

var brokenBoatAnimation = [];
var brokenBoatSpriteData, brokenBoatSpriteSheet;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");

  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpriteSheet = loadImage("assets/boat/boat.png");

  brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.JSON");
  brokenBoatSpriteSheet = loadImage("assets/boat/broken_boat.png");

}

function setup() {
  //canvas = createCanvas(windowWidth - 200, windowHeight - 150);
  canvas = createCanvas(1200,600);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  //tower = new Tower(width / 2 - 650, height - 290, 250, 580);
  tower = new Tower(160, 320, 160, 310)
  //cannon = new Cannon(width / 2 - 600, height / 2 - 220, 120, 40, angle);
  cannon =  new Cannon(180, 120, 50, 30, angle)
  //boat = new Boat(width, height - 100, 200, 200, -100);

  boatFrames = boatSpritedata.frames;
  for(var i =0;i<boatFrames.length;i++)
  {
    var pos = boatFrames[i].position;
    var img = boatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h);
    boatAnimation.push(img);

  }

  brokenBoatFrames = brokenBoatSpritedata.frames;
  for(var i =0;i<brokenBoatFrames.length;i++)
  {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h);
    brokenBoatAnimation.push(img);

  }
  
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);
  ground.display();

  showBoats();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    for (var j = 0; j < boats.length; j++) {
      if (balls[i] !== undefined && boats[j] !== undefined) {
        var collision = Matter.SAT.collides(balls[i].body, boats[j].body);
        if (collision.collided) {
          boats[j].remove(j);

          Matter.World.remove(world, balls[i].body);
          balls.splice(i, 1);
          i--;
          
        }
      } 
    }
  }

  cannon.display();
  tower.display();
}


//creating the cannon ball on key press
function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

// function to show the ball.
function showCannonBalls(ball, index) {
  ball.display();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
    Matter.World.remove(world, ball.body);
    balls.splice(index, 1);
  }
}


//function to show the boat
function showBoats() {
  if (boats.length > 0) {
    if (
      boats.length < 4 &&
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      //var positions = [-130, -100, -120, -80];
      var positions = [-40,-60,-70,-20]
      var position = random(positions);
      var boat = new Boat(width,height - 100, 170, 170, position,boatAnimation);
      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });

      boats[i].display();
      boats[i].animate();
    }
  } else {
    var boat = new Boat(width, height - 100, 200, 200, -100,boatAnimation);
    boats.push(boat);
  }
}


//releasing the cannonball on key release
function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
  }
}


