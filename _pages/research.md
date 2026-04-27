---
layout: page
title: 研究
permalink: /zh/research/
description: SOARLAB 研究方向与平台。
nav: true
nav_order: 2
lang: zh
translation_url: /research/
---

SOARLAB 的目标是建设能够在真实机器人平台上验证的飞行通用智能系统。我们不把“具身智能”仅理解为大模型调用接口，而是关注感知、状态估计、控制、规划、世界模型、行为决策、数据闭环和硬件实验之间的完整链路。

<div class="soar-research-gallery">
  <figure class="soar-research-gallery__main">
    <img src="{{ '/assets/img/publication_preview/omninxt.jpg' | relative_url }}" alt="OmniNxt 全向视觉无人机平台">
    <figcaption>真实飞行平台是检验感知、控制与自主性的基础。</figcaption>
  </figure>
  <figure>
    <img src="{{ '/assets/img/publication_preview/d2slam.jpg' | relative_url }}" alt="D2SLAM 分布式视觉惯性 SLAM 系统">
    <figcaption>分布式空间智能</figcaption>
  </figure>
  <figure>
    <img src="{{ '/assets/img/publication_preview/racer.jpg' | relative_url }}" alt="RACER 多无人机协同探索系统">
    <figcaption>协同探索</figcaption>
  </figure>
</div>

## 两条主线

<div class="soar-research-card-grid">
  <div class="soar-research-card">
    <img src="{{ '/assets/img/publication_preview/fint.jpg' | relative_url }}" alt="狭窄隧道中的自主飞行">
    <div>
      <p class="soar-research-card__kicker">主线 01</p>
      <h3>Robotics Agent</h3>
      <p>研究面向机器人 Agent 的感知、规划控制、世界模型、仿真与强化学习，使机器人能在动态真实环境中完成任务。</p>
    </div>
  </div>
  <div class="soar-research-card">
    <img src="{{ '/assets/img/publication_preview/openprism.jpg' | relative_url }}" alt="OpenPrism 多层研究工具框架图">
    <div>
      <p class="soar-research-card__kicker">主线 02</p>
      <h3>WAM/VLA 机器人基础模型</h3>
      <p>研究 World-Action Model 与 Vision-Language-Action 驱动的机器人基础模型，强调可迁移的动作生成、数据闭环和可落地的实验验证。</p>
    </div>
  </div>
</div>

## 硬件平台

<div class="soar-platform-grid">
  <article>
    <img src="{{ '/assets/img/publication_preview/omni-swarm.jpg' | relative_url }}" alt="Omni-Swarm 无人机集群平台">
    <h3>无人机</h3>
    <p>高速机动、无 GPS 环境感知定位、无人机集群状态估计、协作探索与自主系统。</p>
  </article>
  <article>
    <img src="{{ '/assets/img/soar-game/player-walker.png' | relative_url }}" alt="SOAR 行走形态机器人图标">
    <h3>人形机器人</h3>
    <p>面向具身任务的感知、规划控制、行为决策、仿真到现实迁移和世界模型。</p>
  </article>
  <article>
    <img src="{{ '/assets/img/soar-game/player.png' | relative_url }}" alt="SOAR 飞行形态机器人图标">
    <h3>飞行人形机器人</h3>
    <p>将飞行平台和人形平台结合，探索跨形态机器人通用智能和协同智能。</p>
  </article>
</div>

## 传统优势与新方向

### 空间智能与 SLAM

<img class="soar-research-inline-image" src="{{ '/assets/img/publication_preview/icra-uwb.jpg' | relative_url }}" alt="无人机集群视觉惯性 UWB 融合定位">

课题组继承无人机和足式机器人空间智能方向积累，包括视觉惯性状态估计、分布式 SLAM、协同感知、多机器人一致性优化，以及在真实硬件中的系统部署。

### 无人机集群

<img class="soar-research-inline-image" src="{{ '/assets/img/publication_preview/racer.jpg' | relative_url }}" alt="RACER 多无人机协同探索">

我们关注无 GPS 环境下的无人机集群状态估计、协同探索和自主运行。代表工作包括 Omni-Swarm、D<sup>2</sup>SLAM 和 RACER 等系统。

### 具身智能与协同智能

<img class="soar-research-inline-image" src="{{ '/assets/img/soarlab-512.png' | relative_url }}" alt="SOARLAB 飞行机器人图标">

未来重点发力具身智能与协同智能，包括强化学习、Agent 行为决策、多模态大模型与物理机器人系统结合，以及面向机器人基础模型的数据与评测闭环。

## 开源与系统

已发布或参与发布的系统包括 D<sup>2</sup>SLAM、Omni-Swarm、VINS-Fisheye、FoxTracker 等。新一阶段课题组将继续坚持“算法必须能上真实机器人”的标准。
