var canvas = document.getElementById("game");

var fullwidth = window.innerWidth;
var fullheight = window.innerHeight;
canvas.width = fullwidth;
canvas.height = fullheight;
var context = canvas.getContext('2d');

const birdimage = new Image();
birdimage.src = 'assets/bird.png'

const gap = 300;

const pip_distance = 525;
const pip_width = 100;

const popu = 250;
var aibrains = [];
var aibirds = [];
var ainetworks = [];

var gen = 0;
var notdead = 0;

var jump_step = 19

var themodel = generateNeuralNetwork();

// var bird = generateObject(350, 200, 100, 100);
// var brain = generateBrain();

var pipes = []
var reset = false;

var score = 0;
var highscore = 0;
var bestgen = 0;

var pipespeed = 7;

function spawnAI(){
    aibrains = [];
    aibirds = [];
    ainetworks = [];
    for(i = 0; i < popu; i++){
        aibirds.push(generateObject(350, 200, 75, 75));
        aibrains.push(generateBrain());
        ainetworks.push(generateNeuralNetwork());
    }
}

spawnAI();

function generatePipe(){
    const pipwidth = pip_width;
    const pipeheight = 100+Math.random()*250;
    const spawnx = fullwidth-pipwidth;
    const spawny = fullheight-90-pipeheight;

    const pip1 = generateObject(spawnx, spawny, pipwidth, pipeheight);
    const pipeheight2 = fullheight-90-gap-pipeheight;
    const spawny2 = 0;
    const pip2 = generateObject(spawnx, spawny2, pipwidth, pipeheight2);

    return [pip1, pip2];

}

function checkCollision(pipe1, bird, brain){
    if(
        (bird.posx >= pipe1.posx && bird.posx <= pipe1.posx + pipe1.width ||
         bird.posx + bird.width >= pipe1.posx && bird.posx + bird.width <= pipe1.posx + pipe1.width)
        && 
        (bird.posy >= pipe1.posy && bird.posy <= pipe1.posy + pipe1.height || 
         bird.posy + bird.height >= pipe1.posy && bird.posy + bird.height <= pipe1.posy + pipe1.height)){
        brain.dead = true;
     }
}

function checkPass(pipe1, bird, brain){
    
    if(pipe1.posx < bird.posx+bird.width/2 && !brain.dead){
        if(!pipe1.pass){
            score++;
            if(score >= highscore){
                highscore = score
                bestgen = gen
            }
            pipe1.pass = true
        }
        brain.fitness += 600
    }
}

function drawPipes(){
    context.fillStyle = 'green';
    if(pipes.length == 0){
        var pips = generatePipe();
        pipes.push(pips);
    }
    else if(pipes[pipes.length-1][0].posx < fullwidth - pipes[pipes.length-1][0].width - pip_distance){
        var pips = generatePipe();
        pipes.push(pips);
    }
    
    for(pipe in pipes){
        var pipe1 = pipes[pipe][0];
        var pipe2 = pipes[pipe][1];
        context.fillRect(pipe1.posx, pipe1.posy, pipe1.width, pipe1.height)
        context.fillRect(pipe2.posx, pipe2.posy, pipe2.width, pipe2.height)

        for(index in aibirds){
            var bird = aibirds[index];
            var brain = aibrains[index];
            checkCollision(pipe1, bird, brain)
            checkCollision(pipe2, bird, brain)
            checkPass(pipe1, bird, brain)
        }
        // if(!brain.dead){
            pipe1.posx -= pipespeed;
            pipe2.posx -= pipespeed;
        // }
    }
    if(pipes[0][0].posx <= -400){
        pipes.shift();
        // console.log(pipes.length);
    }
    
}

function drawState(gen){

    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText("Generation: " + gen, fullwidth/2, 50);

    context.font = "20px Arial";
    context.fillText("Survivors: " + notdead, fullwidth/2 - 150, 45);

    context.font = "15px Arial";
    context.fillText("High Score: " + highscore, fullwidth/2 + 240, 30);

    context.fillText("Score: " + score, fullwidth/2 + 350, 30);
    context.fillText("Best Gen: " + bestgen, fullwidth/2 + 240, 50);
}

function getInputs(bird, brain){
    var inputs = [];
    inputs.push((bird.posy)/fullheight)
    var pipex1 = 9999;
    var pipey1 = 9999;
    var pipey2 = 9999;
    for(index in pipes){
        if(pipes[index][0].posx < pipex1 && pipes[index][0].posx > bird.posx-bird.width ){
            pipex1 = pipes[index][0].posx;
            pipey1 = pipes[index][0].posy;
            pipey2 = pipes[index][1].height;
        }
    }
    inputs.push((pipex1)/fullwidth);
    inputs.push((pipey1-bird.posy)/fullheight);
    inputs.push(brain.dy/20);
    // inputs.push((pipey2-bird.posy)/fullheight);

    return inputs;
}

function drawBird(){
    for(index in aibirds){
        var brain = aibrains[index];
        var bird = aibirds[index];
        var draw = true;
        if(brain.dy <= 0){
            if(bird.posy <= fullheight - 90 - bird.height){
                bird.posy += 10;
            }
            else if(!brain.dead){
                brain.dead = true;   
                // console.log("DEAD")
            }
        }
        else{
            bird.posy -= jump_step;
            brain.dy--;
            if(bird.posy < -120){
                bird.dy = 0;
                brain.dead = true;
                draw = false;
                // console.log("DEAD")
            }
        }
        if(draw){
            context.globalAlpha = 0.5
            context.drawImage(birdimage, bird.posx, bird.posy, bird.width, bird.height);
            context.globalAlpha = 1;
        }
    }
}

function start(){
    requestAnimationFrame(start);
    
    context.clearRect(0, 0, fullwidth, fullheight);

    notdead = 0;
    for(index in aibrains){
        var brain = aibrains[index];
        var model = ainetworks[index];
        if(!brain.dead){
            var inputs = getInputs(aibirds[index], aibrains[index]);
            AImove(model, brain, inputs, (move, callbackbrain) => {
                if(!callbackbrain.dead){
                    if(move == 0){
                        // console.log("NO")
                    }
                    else{
                        // console.log("SHET")
                        flap(callbackbrain)
                    }
                }
                else{
                    callbackbrain.dy = 0;
                }
            }, index);
            notdead += 1;
        }
    }
    drawBird();
    drawPipes();
    drawState(gen);
    paintNetwork(themodel);
    for(index in aibrains){
        if(!aibrains[index].dead){
            aibrains[index].fitness++;
        }
    }
    if(notdead == 0 && !reset){
        reset = true
        setTimeout(() => {
            gen += 1;
            score = 0
            pipes = []
            crossover(aibrains, ainetworks, (list, amodel) => {
                aibirds = list[0]
                aibrains = list[1]
                ainetworks = list[2]
                themodel = amodel;
            });
            spawnAI();
            reset = false;
        }, 1500)
    }
    
    
}


function flap(brain){
    brain.dy += 8;
}


// setUpEnvironment()
start();


// document.addEventListener("keydown", (e) => {
//     if(e.keyCode == 32 && !brain.dead){
//         flap();
//     }
// });