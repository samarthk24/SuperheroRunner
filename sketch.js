var max, maxImg, city, cityImg, cone, coneImg, cones, eDrink, eDrinkImg, eDrinks;
var invGround;
var rand;
var score, gameState;
var chargeBar, bar, charge;
var rockMusic;

function preload(){
    maxImg = loadAnimation("max_0.png", "max_1.png", "max_2.png", "max_1.png");
    cityImg = loadImage("city.png");
    coneImg = loadImage("cone.png");
    eDrinkImg = loadImage("energyDrink.png");
    rockMusic = loadSound("Action-Rock.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    rockMusic.loop();

    city = createSprite(width, height-450);
    city.addImage(cityImg);
    city.scale = 6;
    

    max = createSprite(200, height - 100);
    max.addAnimation("running", maxImg);
    max.scale = 4;
    max.setCollider("rectangle", 0, 0, 20, 40);

    invGround = createSprite(width/2, height, width, 100);
    invGround.visible = false;

    cones = createGroup();
    eDrinks = createGroup();

    chargeBar = createSprite(300, 50, 500, 20);
    chargeBar.shapeColor = "red";
    bar = createSprite(75, 50, 50, 20);
    bar.shapeColor = "yellow";
    bar.visible = false;
    charge = 0;

    score = 0;
    gameState = "play";
}

function draw() {
    background(92, 93, 94);
    drawSprites();
    textSize(15);
    fill("yellow");
    text("Score: " + score, width - 150 , 20);

    if(gameState=="play"){
        

        //code for score
        score = score + Math.round(getFrameRate()/60);
        

        //code to move background
        if(charge>0){
            city.velocityX = -(6 + 3*score/100);
        }else{
            city.velocityX = -10;
        }

        if (city.x < 0){
            city.x = width*2;
        }

        //code to jump
        if((keyDown("space") || touches.length>0) && max.y > height-135){
            max.velocityY = -20;
            touches = [];
        }

        if(charge == 0){
            max.velocityY += 1.5;
        }

        max.collide(invGround);

        //spawn objects
        if(frameCount%60==0){
            rand = Math.round(random(1, 4));

            switch(rand){
                case 1:
                    spawnEDrinks();
                    break;1

                case 2:
                    spawnCones();
                    break;
                
                default:
                    break;
            }
        }

        //check if charge bar is filled
        if(bar.width==chargeBar.width){
            charge = 10;
            bar.width = 50;
            bar.visible = false;
            bar.x = 75;
            cones.destroyEach();
            eDrinks.destroyEach();
        }

        if(charge>0){
            if(frameCount%30==0){
                charge -= 1;
            }
            max.y = height - 300;
            score += 50;

        }

        //collect drink
        for (var  i = 0; i < eDrinks.length; i++){
            if(eDrinks[i].isTouching(max)){
                if(bar.visible == true){
                    bar.width += 50;
                    bar.x += 25;
                }else{
                    bar.visible = true;
                }
                eDrinks[i].destroy();
            }
        }

        //check if touching cone
        if(max.isTouching(cones)){
            gameState = "end";
            cones.destroyEach();
            eDrinks.destroyEach();
            
            bar.visible = false;
            chargeBar.visible = false;
            city.velocityX = 0;
        }

        if(max.visible==false){
            max.visible = true;
        }

        
    }

    if(gameState=="end"){
        textSize(50);
        fill("red");
        text("GAME OVER", width/2 - 175, height/2);
        textSize(20);
        text("Tap or press space to restart", width/2 - 150, height/2 + 50);
        max.visible = false;

        if(keyWentDown("space") || touches.length>0){
            reset();
            touches = [];
        }
    }
    
}

function spawnCones() {
    cone = createSprite(width+10, height - 75);
    cone.addImage(coneImg);
    if(charge>0){
        cone.velocityX = -(6 + 3*score/100);
    }else{
        cone.velocityX = -10;
    }
    cone.lifetime = 200;
    cones.add(cone);
    cone.setCollider("rectangle", 0, 0, 25, 40);
}

function spawnEDrinks() {
    eDrink = createSprite(width+10, height - 100);
    eDrink.addImage(eDrinkImg);
    eDrink.scale = 0.25;
    eDrink.rotation = 20;
    if(charge>0){
        eDrink.velocityX = -(6 + 3*score/100);
    }else{
        eDrink.velocityX = -10;
    }
    
    eDrink.lifetime = 200;
    eDrinks.add(eDrink);
}

function reset() {
    
    chargeBar.visible = true;
    bar.width = 50;
    bar.x = 75;
    gameState = "play";
    max.visible = true;
    max.y = height-100;
    score = 0;
}