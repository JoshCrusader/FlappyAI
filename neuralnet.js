var p = 2; // Parents
var cuts = 4; // Cross Over Cuts
var cut_var = 0;

var learning_rate = 0.09
function generateNeuralNetwork(){
    const model = tf.sequential();
    model.add(
        tf.layers.dense({inputShape: [4], units: 2, activation: 'relu'}, useBias = true)
    );

    return model;
}
  
function paintNetwork(model){
    plot1 = []
    plot2 = []
    model.getWeights()[0].data().then((d) => {
        plot1 = d
        return plot1
    }).then((d3) => {
        for(var i = 0; i < 5; i++){
            context.fillRect(50, 50+50*i, 25, 25)
        }
        for(var i = 0; i < 2; i++){
            context.fillRect(100, 100+50*i, 25, 25)
            
        }
        var max2 = Math.max(plot1);
        var min2 = Math.min(plot1);
        for(var i = 0; i < 5; i++){
            for(var x = 0; x < 2; x++){
                var w = plot1[5*i + x];
                if(w >= 0){
                    context.strokeStyle = "green";
                    context.lineWidth = (w/max2)*6;

                }
                else{
                    context.strokeStyle = "red";
                    context.lineWidth = (Math.abs(w)/Math.abs(min2))*6;

                }
                context.beginPath();
                context.moveTo(62.5, 62.5+50*i);
                context.lineTo(112.5, 112.5+50*x);
                context.closePath();
                context.stroke();
            }
        }
    })
    
}

function AImove(model, brain, inputarr, callback, index){
    var predict = model.predict(tf.tensor2d([inputarr], [1, 4]))
    var output = predict.argMax(1)

    output.data().then((d) => {
        
        callback(d[0], brain)
    })
}



function pickParents(fitness, real_fitness){
    /*
        TODO:
        PICK TOP PARENT
        PICK 1 RANDOM PARENT
    */
    console.log(fitness)
    var parents = []
    for(iteration = 0; iteration < p; iteration++){

        var max = fitness[0]
        for(index = 1; index < fitness.length; index++){
            if(fitness[index] == 0){
                fitness[index] = fitness[index-1]
            }
            else{
                max += real_fitness[index]
                fitness[index] = real_fitness[index] + fitness[index-1]
            }
        }

        for(index = 0; index < fitness.length; index++){
            if(real_fitness[index] == 0){
                fitness[index] = - 1
            }
        }
        var random = Math.ceil(Math.random()*max)
        for(index = 0; index < fitness.length; index++){
            if(random <= fitness[index]){
                parents.push(index)
                fitness[index] = 0
                break
            }
        }
        
    }

    return parents
}

function crossover(aibrains, ainetworks, callback){
    fitnesses = []

    var newaibirds = []
    var newaibrains = []
    var newainetworks = []

    

    for(index in aibrains){
        fitnesses.push(aibrains[index].fitness)
    }
    parents_index = pickParents(fitnesses, fitnesses)

    copy = fitnesses.sort();
    fitnesses = []
    for(index in aibrains){
        if(aibrains[index].fitness >= fitnesses[10]){
        fitnesses.push(aibrains[index].fitness * aibrains[index].fitness)
        }
        else{
            fitnesses.push(0)
        }
    }
    god_index = pickParents(fitnesses, fitnesses)
    
    console.log(parents_index)

    for(index in god_index){
        var i = god_index[index]
        newaibrains.push(generateBrain())
        newaibirds.push(generateObject(350, 200, 75, 75))
        newainetworks.push(ainetworks[i])
    }

    var i = parents_index[0];
    var amodel = ainetworks[i];
    var i2 = parents_index[1];

    var weights1 = []
    var weights2 = []


    ainetworks[i].getWeights()[0].data().then((d) =>{
        return weights1.push(d)
    }).then((d) =>{
        return ainetworks[i2].getWeights()[0].data().then((d) =>{
            weights2.push(d)
        })
    }).then((d) => {
        var start_parent = Math.round(Math.random())
        
        var allweights = [weights1, weights2];
        for(i = 0; i < aibrains.length - parents_index.length; i++){

            var new_model = generateNeuralNetwork();
            newaibrains.push(generateBrain())
            newaibirds.push(generateObject(350, 200, 75, 75))

    
            //  4x2
            var new_weights2 = []
            for(x = 0; x < 8; x += cuts){
                for(j = x; j < x+cuts; j++){
                    var val = allweights[start_parent][0][j];
                    if(Math.random() <= learning_rate)
                        val *= -1 + Math.random() * 2
                    new_weights2.push(val)
                }
                start_parent = start_parent == 0 ? 1: 0;
            }


            var start_parent = Math.round(Math.random())
            new_model.layers[0].setWeights([tf.tensor2d(new_weights2, [4,2]), new_model.layers[0].getWeights()[1]])
            newainetworks.push(new_model)
        }
        callback([newaibirds, newaibrains, newainetworks], amodel)

    })

    // alert("NIGA")
}
