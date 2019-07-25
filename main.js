// // Genetic Algorithm

// // Number of Populatoin
// const n = 20
// // Number of Genetic Parents
// const p = 2


// const target = 'unicorn'
// var population = ['unijorm', 'pancake', 'aaaaaah', 'popcorn']
// var fitness = [0, 0, 0, 0]
// var real_fitness = [0, 0, 0, 0]

// function getFitness(word, target){
//     var fitness = 0;
//     for(char in word){
//         if(word[char] == target[char]){
//             fitness += 1;
//         }
//     }
//     return fitness;
// }

// function getPopFitness(){
//     for(index in population){
//         fitness[index] = getFitness(population[index], target)
//         real_fitness[index] = getFitness(population[index], target)
//     }
// }

// function pickParents(){
//     var parents = []
//     for(iteration = 0; iteration < p; iteration++){

//         var max = fitness[0]
//         for(index = 1; index < fitness.length; index++){
//             if(fitness[index] == 0){
//                 fitness[index] = fitness[index-1]
//             }
//             else{
//                 max += real_fitness[index]
//                 fitness[index] = real_fitness[index] + fitness[index-1]
//             }
//         }

//         for(index = 0; index < fitness.length; index++){
//             if(real_fitness[index] == 0){
//                 fitness[index] = - 1
//             }
//         }
//         var random = Math.ceil(Math.random()*max)
//         for(index = 0; index < fitness.length; index++){
//             if(random <= fitness[index]){
//                 parents.push(index)
//                 fitness[index] = 0
//                 break
//             }
//         }
        
//     }

//     console.log(parents)
// }


// function crossOver(){

// }
// getPopFitness()
// pickParents()
