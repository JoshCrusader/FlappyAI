# FLAPPY BIRD AI
A flappy bird game simulated developed using only html5 canvas.
The game has an A.I. of initially (250) bots trying their best to get as far as they can in the game. This A.I. implements the method of Neuroevolution of augmenting topologies (NEAT) which is a genetic algorithm that incorporates a neural network in its process.


## The topology of the neural network
A very simple topology of just the input layer to the output layer with bias (4x2)

## Initial Parameters:
- Population: 250
- Parents: 2
- Mutation rate: 0.09

## Main concepts of genetic algorithm (For review):
- Heredity - Species of the new generation is able to inherit genes (information) of the fittest parents of the previous generation
    - **How its done in this project:**
    - get the 4 weights of the random parents alternatively
- Variation - Has different ways to produce new species 
    - **How its done in this project:**
    - Mutation
    - Random weights
- Selection - Gets the weighted random of (2) parents, the weight of choosing the parents is the fitness (How long the bird lived) and additionally if they pass a pipe its an additional fitness for increased reward (reward gates).



This was developed to be a mini project for me to understand how genetic algorithms work for a bigger project.