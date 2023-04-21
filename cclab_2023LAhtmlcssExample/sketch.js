function setup() {
  let canvas = createCanvas(500, 400);
  canvas.parent("canvasContainer");
  background(220);
}



let particles = [];
let mouses = [];

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("canvasContainer");
  background(220);
  for (i=0; i<10; i++){
    particles.push(new Particle(random(width), random(height), random(10, 100)));
  }
}

function draw() {
  //background("rgba(0,0,0,0.01)");
  background(0);
  
  for (i=0; i<mouses.length; i++){
    if (mouses[i].isDead()){
      mouses[i].splice(i,1);
    }else{
       mouses[i].display();
    } 
  }
  
  for (i=0; i<particles.length; i++){
    let p = particles[i];
    for (j=0; j<particles.length;j++){
      if(i != j){
        let q = particles[j];
        let distance = p5.Vector.sub(p.pos, q.pos).mag();
        let touch = p.rad+q.rad;
        //console.log("distance",distance);
        //console.log("touch", touch);
        if(distance < touch+5){
          //console.log("collide");
          p.repel(q.pos);
          p.vel.mult(-0.1);
        }
      }
    }
    p.attractNoise();
    p.attractMouse();
    p.move();
    p.display();
  }
}

function mousePressed(){
    for (i=0; i<particles.length; i++){
    let p = particles[i];
    p.repelMouse();
    mouses.push (new Mouse(mouseX, mouseY));
  }
    
  }
  

class Particle {
  constructor(x, y, m){
    this.pos = createVector(x, y);
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.mass = m;
    this.rad = m/4;
  }
  
  move(){
    // this.pos.x= cos(frameCount*0.05)*100;
    // this.pos.y= sin(frameCount*0.05)*100;
    this.vel.add(this.acc);
    this.vel.limit(5);
    this.pos.add(this.vel);
    this.acc.mult(0.95);
  }
  
  applyForce(f) {
    let force = p5.Vector.div(f, this.mass);
    this.acc.add(force);
  }
  
  
  attractNoise(){
    let attractor = createVector(map(noise(frameCount*10), 0, 1, -width/2,width/2),map(noise(frameCount*0.01), 0, 1, -width/2,width/2));
    let force = p5.Vector.sub(attractor, this.pos);
    force.limit(0.6);
    this.applyForce(force);
  }
  
  attractMouse(){
    let attractorPos = createVector(mouseX-width/2, mouseY-width/2);
    let force = p5.Vector.sub(attractorPos, this.pos);
    force.limit(0.6);
    this.applyForce(force);
  }
  
  repelMouse(){
    let attractorPos = createVector(mouseX-width/2, mouseY-width/2);
    let force = p5.Vector.sub(this.pos, attractorPos);
    //force.limit(1);
    this.applyForce(force);
  }
  
  repel(p){
    let force = p5.Vector.sub(this.pos, p);
    force.normalize();
    force.mult(2);
    //console.log(force.mag());
    this.applyForce(force);
  }
  
  display(){
    push();
    stroke(255,255,255);
    noFill();
//     translate(width/2, height/2);
//     circle(this.pos.x, this.pos.y, 70)
    translate(width/2, height/2);
    translate(this.pos.x, this.pos.y);
    circle(0, 0, this.rad*2)
    stroke(0,255,255);
    circle( 1,0,this.rad*2)
    stroke(255,0,255);
    circle(-1,0,this.rad*2)
    pop();
  }
  
}

class Mouse {
  constructor(x,y){
    this.pos = createVector(x,y);
    this.lifespan = 255;
    this.rad = 25;
  }
  
  
  update(){
    this.pos.x=mouseX;
    this.pos.y=mouseY;
  }
  display(){
    push();
    noFill();
    
    stroke(this.lifespan);
    this.lifespan *=0.96;
    this.rad +=5;
    circle(this.pos.x,this.pos.y, this.rad);
    pop();
  }
  
   isDead() {
    if (this.lifespan < 0.0) {
      return true;
    } else {
      return false;
    }
  }
  
  
  
}