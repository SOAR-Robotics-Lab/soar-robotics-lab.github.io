---
layout: page
title: research
permalink: /research/
description: Research directions and platforms of SOARLAB.
nav: true
nav_order: 2
lang: en
translation_url: /zh/research/
---

SOARLAB aims to build flying general intelligence that can be validated on real robotic platforms. We treat embodied intelligence as a full-stack problem that connects perception, state estimation, control, planning, world models, behavior decision-making, data loops, and hardware experiments.

<div class="soar-research-gallery">
  <figure class="soar-research-gallery__main">
    <img src="{{ '/assets/img/publication_preview/omninxt.jpg' | relative_url }}" alt="OmniNxt aerial robot platform with omnidirectional visual perception">
    <figcaption>Real aerial platforms are the baseline for testing perception, control, and autonomy.</figcaption>
  </figure>
  <figure>
    <img src="{{ '/assets/img/publication_preview/d2slam.jpg' | relative_url }}" alt="D2SLAM collaborative visual-inertial SLAM system">
    <figcaption>Distributed spatial intelligence</figcaption>
  </figure>
  <figure>
    <img src="{{ '/assets/img/publication_preview/racer.jpg' | relative_url }}" alt="RACER decentralized multi-UAV exploration system">
    <figcaption>Collaborative exploration</figcaption>
  </figure>
</div>

## Two Core Lines

<div class="soar-research-card-grid">
  <div class="soar-research-card">
    <img src="{{ '/assets/img/publication_preview/fint.jpg' | relative_url }}" alt="Autonomous flight inside narrow tunnels">
    <div>
      <p class="soar-research-card__kicker">Line 01</p>
      <h3>Robotics Agent</h3>
      <p>We study agent-oriented perception, planning/control, world models, simulation, and reinforcement learning so robots can complete tasks in dynamic real-world environments.</p>
    </div>
  </div>
  <div class="soar-research-card">
    <img src="{{ '/assets/img/publication_preview/openprism.jpg' | relative_url }}" alt="OpenPrism multi-tier research tooling diagram">
    <div>
      <p class="soar-research-card__kicker">Line 02</p>
      <h3>WAM/VLA Foundation Models</h3>
      <p>We develop world-action and vision-language-action robot foundation models, emphasizing transferable action generation, data loops, and real-world validation.</p>
    </div>
  </div>
</div>

## Hardware Platforms

<div class="soar-platform-grid">
  <article>
    <img src="{{ '/assets/img/publication_preview/omni-swarm.jpg' | relative_url }}" alt="Omni-Swarm aerial robot swarm platform">
    <h3>Aerial robots</h3>
    <p>Agile flight, GNSS-denied perception/localization, swarm state estimation, collaborative exploration, and autonomous systems.</p>
  </article>
  <article>
    <img src="{{ '/assets/img/soar-game/player-walker.png' | relative_url }}" alt="SOAR robot in walking mode">
    <h3>Humanoids</h3>
    <p>Perception, planning/control, decision-making, sim-to-real transfer, and world models for embodied tasks.</p>
  </article>
  <article>
    <img src="{{ '/assets/img/soar-game/player.png' | relative_url }}" alt="SOAR robot in flying mode">
    <h3>Flying humanoids</h3>
    <p>Combining aerial and humanoid platforms to study cross-embodiment general and collaborative intelligence.</p>
  </article>
</div>

## Existing Strengths and New Directions

### Spatial Intelligence and SLAM

<img class="soar-research-inline-image" src="{{ '/assets/img/publication_preview/icra-uwb.jpg' | relative_url }}" alt="Visual-inertial-UWB fusion for aerial swarms">

The lab builds on prior work in spatial intelligence for aerial and legged robots, including visual-inertial state estimation, distributed SLAM, collaborative perception, multi-robot consistency optimization, and deployment on real hardware.

### Aerial Swarms

<img class="soar-research-inline-image" src="{{ '/assets/img/publication_preview/racer.jpg' | relative_url }}" alt="Decentralized multi-UAV exploration with RACER">

We study aerial swarm state estimation, collaborative exploration, and autonomous operation in GNSS-denied environments. Representative systems include Omni-Swarm, D<sup>2</sup>SLAM, and RACER.

### Embodied and Collaborative Intelligence

<img class="soar-research-inline-image" src="{{ '/assets/img/soarlab-512.png' | relative_url }}" alt="SOARLAB flying robot icon">

Future work focuses on embodied and collaborative intelligence, including reinforcement learning, agent behavior decision-making, multimodal models integrated with physical robots, and data/evaluation loops for robot foundation models.

## Open Systems

Released or contributed systems include D<sup>2</sup>SLAM, Omni-Swarm, VINS-Fisheye, and FoxTracker. The next stage will keep the standard that algorithms should run on real robots.
