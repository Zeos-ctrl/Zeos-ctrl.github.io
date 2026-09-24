---
date: 2026-09-24
aliases:
  - Accelerating effective-one-body gravitational waveforms withSVD-compressed neural networks and match-based training
tags:
  - gravitational_waves
  - machine_learning
---
*How I built FLARE, a neural-network surrogate for the SEOBNRv4 waveform family, and what an AI agent taught me about training it.*

---

I was on YouTube one day when I came across a video from Emergent Garden in which he builds an "autoresearch" program, which is an AI agent that proposes and tests its own models for a fractal problem (https://www.youtube.com/watch?v=t7_ZXgfJVG8&t=8s). What amazed me was how easy it made it look. Give the agent a dataset and a goal, and it works through the problem methodically until it finds the best solution it can.

I'd finished my dissertation feeling dissatisfied with my results. I was proud of getting close to a match of 0.98, but the mean result just wasn't there. Watching that video gave me an idea. What if I used an agent as an optimiser, and let it suggest the solutions I'd missed? I had used Optuna for optimising hyperparameters so surely this would be the version for architectures.

In this post I'll explain how I set up the autoresearch loop and what the agent discovered. But first, for anyone unfamiliar with my dissertation, a bit of background. (The code is here: https://github.com/Zeos-ctrl/FLARE)

## The problem - accurate models are slow

When LIGO and Virgo detect a gravitational wave, we work out what produced it by comparing the data against *templates banks* which are filled with waveform examples for different black-hole masses and spins. A single analysis can need millions of them, so how fast you can generate a template really matters.

There are two big families of waveform models in use today.

**IMRPhenom** models are *phenomenological*. They're closed-form expressions built from post-Newtonian theory for the inspiral, with the merger and ringdown fitted to numerical relativity simulations. Because they're analytic, and usually written in the frequency domain, they're fast.

**SEOBNR** models are built on the *effective-one-body* (EOB) formalism. They map the two-body problem onto a single effective particle, integrate Hamilton's equations through the entire inspiral, and then attach a merger–ringdown model calibrated to numerical relativity. They're among the most accurate models available, but that ODE integration is expensive.

On my machine, one SEOBNRv4 waveform took about **214 ms** to generate. The higher-mode version, SEOBNRv4HM, took about **403 ms**, because every extra mode has to be computed and then combined for the observer's viewing angle.

A few hundred milliseconds doesn't sound like much, until you multiply it by a million.

## The idea behind using Neural Networks

Surrogate models are the established fix for this. You generate a bank of waveforms once, up front, and then build something that can reproduce new ones cheaply. Classical surrogates interpolate across parameter space, and more recent work (Khan & Green's ANN-Sur, Schmidt et al.'s mlgw, and others) replaces the interpolation with a neural network.

That was the plan for FLARE too. My dissertation version got the basic idea working, but it plateaued. So I handed the problem to an agent.

## Handing the problem to an agent

I set up a small Python FastAPI server that the agent could submit a model architecture to. This could be an entirely new model or just different hyperparameters. Each submitted model was then trained on the dataset and evaluated on how well it maximised the match statistic between the dataset waveforms and the generated waveforms. A higher match meant a more faithful waveform that could be used in parameter estimation.

The agent was Anthropic's Claude Opus 4.8, given a budget of 10 rounds and told that the goal was "to maximise the match statistic". After each experiment, the result was added to a leaderboard that the model could check against, and it would then strategise a new solution based on that result. This loop led the model to try out methods I hadn't thought of, ones that were in the literature but that I'd missed in my review back at uni.

What came back was a pipeline with four stages, two of which I hadn't thought of:

1. Split each waveform into **amplitude and phase**.
2. Compress both with an **SVD** down to 150 numbers each, instead of the 16,384 samples the network was originally predicting. *(The agent's first big suggestion.)*
3. Feed the network **physics-informed input features** instead of raw masses and spins.
4. Train in two stages: an **MSE warm start**, then **fine-tuning directly on the match**, the statistic I actually cared about. *(The agent's second big suggestion.)*

In hindsight these suggestions seem so obvious. I was already optimising the dataset by splitting into amplitude and phase targets as they were simpler to solve and I had learned about optimising a goal loss function. However in the time pressure of the project I had completely missed those solutions. Let's walk through each step.

## Step 1 - Amplitude and phase instead of raw strain

A gravitational waveform is a rapidly oscillating signal, a sin wave that speed up as the black holes spiral in. Asking a network to predict that directly, sample by sample, is a hard regression problem due to spectral bias where neural networks have the tendency to learn the low-frequency part of an oscillating wave but struggles at the high-frequency.

But you can rewrite the signal as a slowly varying envelope multiplied by a smoothly increasing phase:

$$h_+(t) = A(t)\cos\phi(t)$$

Both $A(t)$ and $\phi(t)$ are smooth, well-behaved curves, and far easier to learn. I recover them with a Hilbert transform, which gives the analytic signal. Its modulus is the amplitude, and its (unwrapped) argument is the phase.

![[waveform_deconstruction.png]]

## Step 2 - Compress with an SVD

This is where the agent made its first real contribution, I had never heard of an SVD beforehand but after learning the theory its application was a no-brainer.

I'd generated 20,000 waveforms, each on a 4-second grid at 4096 Hz: 16,384 samples per waveform. My network was trying to spit out all 16,384 numbers. That's wasteful. Neighbouring samples are extremely correlated, so the waveforms actually live in a much lower-dimensional space.

A singular value decomposition finds that structure. Stack all the amplitude curves (or phase curves) into a matrix $M$ and factor it:

$$M = USV^T$$

The rows of $V^T$ are a **dictionary of template shapes** shared by the whole dataset. Folding $S$ into $U$ gives a coefficient matrix $C = US$, so each waveform becomes a list of coefficients saying *how much of each template shape to use*.

![[svd_dictionary.png]]

The amplitude basis vectors are concentrated around the merger, where the envelope changes quickly. The phase basis vectors span the whole inspiral, where phase piles up.

The singular values drop off fast. Keeping just the top **150** templates retains **99.99%** of the phase energy and **99.96%** of the amplitude energy. Keep more than that and the reconstruction barely improves, while the coefficients get noisier and harder to predict.

![[svd_spectrum.png]]

So each waveform shrinks from 16,384 samples to 150 coefficients per channel, and the network's job becomes a compact map from physical parameters to coefficients.

There's a nice bonus, too. Because the rows of $V^T$ are orthonormal, error in coefficient space *equals* reconstruction error in the time domain. Training on 150 coefficients optimises exactly the same thing as training on all 16,384 samples, just far more cheaply.

## Step 3 - Give the full physics so it doesn't need to relearn it

Each waveform is defined by four parameters: two masses and two aligned spins. But these are awkward inputs. The waveform mostly depends on *combinations* of them.

So instead of four raw numbers, the network gets an **11-dimensional feature vector**:

- **Mass features (7):** chirp mass $\mathcal{M}$, symmetric mass ratio $\eta$, mass ratio $q$, their logarithms, and $\mathcal{M}^{-5/3}$
- **Spin features (4):** effective spin $\chi_\text{eff}$, the two component spins, and the reduced-spin parameter $\chi_\text{PN}$

The $\mathcal{M}^{-5/3}$ term is a good example of why this helps. The phase has to be predicted to roughly one part in $10^4$ before the match starts to suffer, and at leading order the inspiral phase scales as $\mathcal{M}^{-5/3}$. Hand the network $\log\mathcal{M}$ and that power law becomes a *linear* relationship. Without it, the network would have to learn the power law from scratch.

The feature set is deliberately over-complete. The amplitude and phase networks have different targets, and each can lean on whichever encoding makes its job easiest. The extra inputs cost almost nothing.

## The architecture

Nothing exotic here. There are two separate networks, one for the amplitude coefficients and one for the phase, because the phase is much harder and benefits from dedicated capacity. Each is an 8-layer MLP with 512 units per layer, LayerNorm and SiLU activations: about 1.9M parameters each, 3.9M in total.

SiLU was chosen because it's smooth, and the SVD has already turned the problem into one of learning smooth functions. The predicted coefficients are multiplied back against the stored basis to rebuild $A(t)$ and $\phi(t)$, which are then combined into $h_+ = A\cos\phi$.

This architecture is a lot simpler than the one I had used for my dissertation as the optimisation of the dataset made this an easier target to learn.

## Step 4 - Optimise the training for what we actually want

This was the agent's second find, and the most important lesson of the whole project.

In gravitational-wave work, the standard measure of how similar two waveforms are is the **noise-weighted match**. Which is a normalised overlap, weighted by the detector's noise spectrum and maximised over time and phase shifts. A match of 1 means the waveforms are identical.

My dissertation version trained only with mean squared error on the full amplitude and phase data. My mean match was around **0.6-0.7** for my dissertation, but for this retake on average, the results looked fine with a mean match of about **0.967** (another benefit of the SVD optimisation). But the *tail* was ugly. Some held-out waveforms had matches around **0.5**, which is a completely wrong waveform, and about 42% of waveforms fell below the 0.98 threshold.

That tail matters. A handful of badly reconstructed waveforms in the wrong part of parameter space can drag a posterior in the wrong direction.

The agent's fix was to **fine-tune directly on the mismatch** $1 - \mathcal{F}$. This meant we need to rebuild each predicted waveform, compute its match against the truth, and backpropagate through that. You can't start there, because maximising over time and phase shifts makes the match non-convex and hard to optimise from a random initialisation. But once the MSE warm start has put the network in a good basin, match fine-tuning works very well.

![[match_vs_mse.png]]

After fine-tuning:

| | MSE only | + Match fine-tuning |
|---|---|---|
| Mean match | ~0.967 | **0.996** |
| Worst case | ~0.51 | **0.971** |
| Fraction below 0.98 | 42% | **0.2%** |

The mean went up, but more importantly, the dangerous tail essentially disappeared. This was the result I'd been missing at the end of my dissertation.

(Training details for those who want them: AdamW with cosine annealing. A warm start of up to 2,000 epochs at lr 5×10⁻⁴, weight decay 0.1, dropout 0.15, and early stopping with patience 300. Then 400 epochs of match fine-tuning at lr 5×10⁻⁵.)

## Does it work for real parameter estimation?

Matching waveforms on a test set is one thing. The real test is whether swapping FLARE in for SEOBNRv4 changes the science.

So I ran nested sampling (with dynesty) on **13 real events** from LIGO–Virgo's first three observing runs, once with FLARE and once with PyCBC's SEOBNRv4. Everything else (the data, priors and likelihood) stayed fixed.

![[flare-vs-pycbc-ci.png]]

The results:

- The 90% chirp-mass credible intervals **overlap for all 13 events**.
- The median offset between the two generators' chirp-mass estimates is **1.3 M⊙**.
- FLARE reproduces the *width* of the intervals, not just the centre.
- End to end, the runs were on average **2.6× faster**.

For GW150914, the first ever detection, the posteriors from the two generators are almost indistinguishable across both masses and both spins.

![[gw150914-FLARE.png]]

### The one that disagreed

GW190521_074359 was the awkward one. On the first pass, the two generators' intervals didn't overlap at all, and my first thought was that the surrogate had got it wrong.

So I tested it directly. I fixed the masses at the values PyCBC preferred and swept the spin. FLARE matched SEOBNRv4 at **0.9992** at the recovered spin and stayed above 0.998 across the whole sweep. The templates agreed exactly where it mattered.

The real culprit was the sampler. This event has a broad likelihood with a strong mass–spin degeneracy, and with only 250 live points the two runs had wandered into different parts of it. Re-running both with 1,500 live points brought the intervals into (marginal) overlap. The FLARE posterior is still noticeably broader, and the medians still differ by about 4.8 M⊙, but that reflects a genuinely hard, degenerate posterior rather than a template error.

It was a useful reminder to always check the testing setup.

## Higher modes

The dominant (2,2) mode is only part of the signal. For unequal masses and inclined viewing angles, the higher modes carry real information, especially about inclination.

The higher-mode version of FLARE learns five modes, (2,1), (2,2), (3,3), (4,4) and (5,5), each with the same pipeline, and recombines them using spin-weighted spherical harmonics. Fine-tuning uses the match on the *combined* waveform at sampled inclinations, the same trick the agent found for the dominant mode.

![[dom-match.png]]

The mean match ranges from **0.994 face-on** to **0.968 edge-on**. Edge-on is the hardest case, because that's where the subdominant modes contribute most and any errors in them show up directly. The worst case there drops to about 0.88.

On six simulated signals at a network SNR of 25, FLARE recovered masses, inclination and distance consistently with PyCBC's SEOBNRv4HM, while running roughly **6–10× faster** end to end.

![[inj00.png]]

## How fast is it?

Here's per-waveform generation time on identical hardware:

| | SEOBNRv4 (1 CPU core) | FLARE (1 CPU core) | FLARE (GPU) |
|---|---|---|---|
| Dominant mode | 214 ms | 4.4 ms (**48×**) | 1.3 ms (**161×**) |
| Higher modes | 403 ms | 17.1 ms (**24×**) | 5.2 ms (**77×**) |

So why is the end-to-end speed-up "only" 2.6×? Because a parameter-estimation likelihood has two costs; generating the template, and then matched-filtering it against the data. FLARE speeds up the first but leaves the second unchanged. Once templates are cheap, filtering dominates.

This also means FLARE's value depends on what it's replacing. Against an expensive time-domain EOB model, it's a big win. Against a fast frequency-domain approximant, most of the gain would disappear.

## Limitations

The agent got me a long way, but I want to be upfront about where FLARE still falls short.

- **Accuracy gap.** FLARE's mean mismatch is around 4×10⁻³, while comparable published surrogates reach 10⁻⁴ to 10⁻⁵. The SVD isn't the bottleneck, since it can reconstruct waveforms far more accurately than that. Most of the remaining error comes from the network.
- **Narrow parameter range.** Training covered 20–100 M⊙ on a fixed 4-second window. That excludes the long, low-mass signals where EOB models are *most* expensive and a surrogate would help most.
- **Edge-on higher modes.** The worst-case match drops to about 0.88 for edge-on systems.
- **Older model.** SEOBNRv4 has since been superseded by the SEOBNRv5 family.

## What I'd do next

If I keep going, and I'll probably hand some of these back to the agent, the obvious next steps are:

- **Longer, lighter signals**, using variable-length or multi-banded time grids.
- **Closing the accuracy gap** with larger training sets, ensembles or residual-error networks.
- **Mode-specific loss weighting** to improve edge-on higher-mode performance.
- **Moving to SEOBNRv5HM and SEOBNRv5PHM**, including precession.

Because FLARE is differentiable and runs on a GPU, it could also slot naturally into gradient-based samplers, or be used to generate training banks for simulation-based inference methods like DINGO.

As a next step, I plan to run an ablation study to work out which changes made the model better or worse.

## Takeaways

I started this wanting to see whether an agent could find what I'd missed. It did, and the ideas it found are general enough that I'd recommend them to anyone building a surrogate for a physics model:

1. Decompose before you learn. Amplitude/phase plus an SVD turns a brutal regression into a smooth, low-dimensional one.
2. Put the physics into the inputs. If theory tells you which combinations of parameters matter, hand them to the network instead of making it rediscover them.
3. Train on the metric you'll be judged by. An MSE-trained model can look fine on average while hiding a tail of badly wrong outputs. Fine-tuning on the actual match fixed that almost completely.

And one more, about the process itself that an agent makes a good second pair of eyes. Neither of its big finds was new science. They were the kind of ideas that are obvious in hindsight, which is exactly why they're easy to miss when you've been staring at the same problem for months.

---

*Thanks for reading! If you work on waveform modelling or surrogate methods and have thoughts, I'd love to hear them.*
