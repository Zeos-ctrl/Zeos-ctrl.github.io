---
title: Making A Gravitational Waveform Generator Using Machine Learning
date: 2025-10-13
draft: false
tags:
  - machine_learning
  - gravitational_waves
  - parameter_estimation
---

During the course of my Master's degree in Data Intensive Physics, I spent my time learning how machine learning algorithms work and how to analyze gravitational wave signals. The main way we analyzed the data from gravitational waves was to do parameter estimation to try and estimate some of the parameters of the black holes that merged to create the waveform. During my 'Observational Gravitational Wave Astronomy' module, this culminated in a final project where we used Markov Chain Monte Carlo methods to estimate the parameters of GW150914, which was the first detected signal. This analysis consisted of using a surrogate generator (a program to generate a waveform), overlapping the generated waveform with the detected signal, measuring how similar they are, and repeating this process until we find the best match between the generated and measured signals. As you could probably tell, one of the bottlenecks in this system is the generation of the waveforms. There are multiple waveform families, which I won't go into in this post, but the main ones we looked at are Inspiral-Merger-Ringdown Phenomenological models (IMRPhenom) and Effective-One-Body models (EOB). These models simulate the same merger but use different mathematics to accomplish that. The IMR waveforms are less accurate but faster to generate, while the EOB models are more accurate but take a lot longer to produce. To overcome the generation time constraint, researchers generate "Waveform banks," which are precomputed waveforms that can be used within parameter estimation pipelines. These waveform banks typically contain 100,000 to 1,000,000 signals, making them large and time-consuming to generate.

![[2025-10-13-131804_907x341_scrot.png]]

For my summer project, I ended up working on a parameter estimation pipeline using Simulation-Based Inference (SBI). TL;DR: SBI works by running lots of realistic simulations and letting a machine-learning model learn which source parameters match the observed data. This makes it much faster and easier to obtain reliable parameter estimates and uncertainties. To train a reliable model, you require a massive waveform bank, which would take a long time to generate. This is where my summer project came in, as I wanted to create a model that would learn the function of the mergers and generate waveforms quickly.

## Background

Initially, I thought of using Fourier Neural Operators (FNO) to learn the partial derivative functions behind the black hole evolution equations. FNOs are machine learning networks that learn partial differential equations and have been used to model systems like fluid evolution (https://zongyi-li.github.io/blog/2020/fourier-pde/). The idea was that the model would take in some randomly generated input parameters and produce a gravitational wave signal. It didn't work. The problem with trying to learn an oscillating signal is spectral bias, where a model learns the low-frequency target first and fails at learning the high-frequency part. This results in a signal that generalises well initially but then fails spectacularly.

![[2025-10-13-spectral-bias.png]]

To solve this I needed to either:
1. Use a model which could work around spectral bias.
2. Or simplify the input we are trying to learn.
I went with both options.

## The Model

To work around spectral bias, I split my model into smaller sub-models, which we will call banks, and had them learn a small section of the target waveform. This way, the model doesn't just learn the low-frequency and high-frequency sections at the same time, but the final signal is the summation of all the predictions from the smaller models. This parallelisation makes learning easier.

The next way to make it easier to learn, is to change the input data. Oscillating data is hard to model so I though about decomposing it into an Amplitude and Phase target. By learning and predicting amplitude and phase, the waveform can be reconstructed by the formula,
$$h_+(t) = A(t)cos(\phi(t)),h_\times = A(t)sin(\phi(t))$$
Where $h_+$ and $h_\times$ represent the polarisation of the signal. In the plots below I have the amplitude and phase change over time. The amplitude is the strength of the signal, and the phase follows where the objects are in their orbit.

![[2025-10-13-135522_460x169_scrot.png]]

These are much simpler and easier to work with, and as a result, we get a model that can learn the functions well. We now have the inputs and targets for our model. We use the masses and spins of the black holes as inputs and have the amplitude and phase as targets. I generated the data using PyCBC and decomposed the generated waveform into the two arrays ready for training. The figure below shows the network structure. I joined the normalised arrays for both targets with the input parameters and trained a regression network. There are two networks that need to be trained, one for each target. These networks are made up of $k$ "banks," which are subnetworks used to make the learning process easier. After they are trained, we can use the amplitude and phase predictions to reconstruct the model.

![[2025-10-13-133258_214x408_scrot.png]]

A few additional things the network does involves estimating the uncertainty of its predictions using a Laplacian (Laplace) approximation over the final weights of the amplitude network.

Imagine the network’s loss landscape as a mountain range spread over a grid where each point in that grid represents a possible configuration of the network’s weights. The valleys in this range correspond to regions where the model fits the data well. Now, the Laplacian doesn’t measure how _high_ the mountains are, instead, it measures how _sharp or wide_ the valleys are around their lowest points. A steep, narrow valley means the network is confident as small shifts in weights quickly make things worse, while a wide, gentle valley means it’s less certain. In essence, the Laplacian captures the curvature of that landscape, turning the hidden shape of the mountains into a measure of how confident the model is in its predictions. After completing this network, I tested it against PyCBC for generation speed and accuracy.

## Results

### Speed of Inference

The first test I did was generate a bunch of waveforms using PyCBC and my network to compare how fast the network is at inference. This network uses GPU batch generation, where I can get an array of inputs and, in one forward pass, obtain the corresponding outputs. The table below shows this comparison for generating 10, 100, and 1000 waveforms in seconds. For single inference, my model was comparable to the IMRPhenomD approximant. However, for batch generation, it was significantly faster.

| Model               | $n=10$ | $n=100$ | $n=1000$ |
| ------------------- | ------ | ------- | -------- |
| SEOBNRv4            | 1.954  | 19.601  | 196.136  |
| IMRPhenomD          | 0.102  | 0.557   | 5.627    |
| My Model Single Gen | 0.318  | 0.548   | 5.940    |
| My Model Batch Gen  | 0.013  | 0.138   | 1.406    |

This is great and all, but if the model isn't accurate, this research has been worthless. To test the accuracy, I generated two waveforms using the same prior parameters and used the inner dot product match to see how similar they are. The following was using the IMRPhenomD approximant, and my model achieved a match of $\approx 0.992$. 

![[2025-10-13-waveform_plots.png]]

### Accuracy compared to the ground truth

To test the reliability of the model, I conducted the same test with 1000 different prior parameters. The following shows the results. The IMRPhenom model had a mean accuracy of approximately 0.98, whereas the SEOBNRv4 model had an accuracy of approximately 0.610. The low accuracy of the EOB model was due to a poor set of hyperparameters, which I didn't have time to change for my final tests, as the deadline was a day away when the final tests were performed. As a side note, training on a dataset of 10,000 samples took about a day on my PC at home... To run 50 hyperparameter tuning runs, it took a day per model. My computer isn't even that slow, it has a Radeon RX 6800 graphics card, a Ryzen 5 3600 CPU, and 16 GB of RAM.

![[2025-10-13-comparison_n1000.png]]

### SBI

Finally, I tested this network in SBI, which is what this entire project was about, a week before the deadline. This definitely didn't do me any favors, as I worked long nights to get this model integrated into a separate codebase. Eventually, however, I managed to get a training run in using my generated waveforms and obtained the following results!

![[2025-10-13-corner_plot.png]]

Ideally, you want the blue cross to be in the jelly bean shape in the bottom left plot, as this is the injected value. The orange plot is using Bilby, and the green plot is using the SBI project I was a part of. The jelly bean shape on the SBI plot is much larger and off-center compared to Bilby, which could be due to not enough training data or poor hyperparameters in the model. Even though I know it's not better than the pre-established Bilby project, I'm just glad the SBI network was able to learn from my generator.

## Final Thoughts

I set out to create a waveform generator to accelerate the construction of gravitational wave templates for parameter estimation, and I was somewhat successful! My model was able to generate data that matched the input data with a high degree of accuracy, and I was able to integrate the project within another project.

This project has a lot of room for expansion:
1. Train more networks on different waveform approximants
2. Train on wider priors, so we can generate a larger waveform bank
3. Update the model to train on noise or even long lived Neutron star mergers

This project is still under development and has a GitHub repo at https://github.com/Zeos-ctrl/SPECTRE if you want to play around with it!