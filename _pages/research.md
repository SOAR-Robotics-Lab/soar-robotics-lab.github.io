---
layout: page
title: research
permalink: /research/
description: "Research directions and platforms of SOARLAB."
nav: true
nav_order: 2
---

# 研究方向 / Research

SOARLAB 的目标是建设能够在真实机器人平台上验证的飞行通用智能系统。我们不把“具身智能”仅理解为大模型调用接口，而是关注感知、状态估计、控制、规划、世界模型、行为决策、数据闭环和硬件实验之间的完整链路。

SOARLAB aims to build flying general intelligence that can be validated on real robotic platforms. We treat embodied intelligence as a full-stack problem that connects perception, state estimation, control, planning, world models, behavior decision-making, data loops, and hardware experiments.

## 两条主线 / Two Core Lines

<div class="row">
  <div class="col-md-6">
    <div class="card mb-3">
      <div class="card-body">
        <h3 class="card-title">Robotics Agent</h3>
        <p>研究面向机器人 Agent 的感知、规划控制、世界模型、仿真与强化学习，使机器人能在动态真实环境中完成任务。</p>
        <p>We study agent-oriented perception, planning/control, world models, simulation, and reinforcement learning so robots can complete tasks in dynamic real-world environments.</p>
      </div>
    </div>
  </div>
  <div class="col-md-6">
    <div class="card mb-3">
      <div class="card-body">
        <h3 class="card-title">WAM/VLA Foundation Models</h3>
        <p>研究 World-Action Model 与 Vision-Language-Action 驱动的机器人基础模型，强调可迁移的动作生成和可落地的实验验证。</p>
        <p>We develop world-action and vision-language-action robot foundation models, emphasizing transferable action generation and real-world validation.</p>
      </div>
    </div>
  </div>
</div>

## 硬件平台 / Hardware Platforms

| 平台 / Platform                   | 研究目标 / Research Goal                                                                                                                                                                              |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 无人机 / Aerial robots            | 高速机动、无 GPS 环境感知定位、无人机集群状态估计、协作探索与自主系统。 Agile flight, GNSS-denied perception/localization, swarm state estimation, collaborative exploration, and autonomous systems. |
| 人形机器人 / Humanoids            | 面向具身任务的感知、规划控制、行为决策、仿真到现实迁移和世界模型。 Perception, planning/control, decision-making, sim-to-real transfer, and world models for embodied tasks.                          |
| 飞行人形机器人 / Flying humanoids | 将飞行平台和人形平台结合，探索跨形态机器人通用智能和协同智能。 Combining aerial and humanoid platforms to study cross-embodiment general and collaborative intelligence.                              |

## 传统优势与新方向 / Existing Strengths and New Directions

### 空间智能与 SLAM / Spatial Intelligence and SLAM

课题组继承无人机和足式机器人空间智能方向积累，包括视觉惯性状态估计、分布式 SLAM、协同感知、多机器人一致性优化，以及在真实硬件中的系统部署。

The lab builds on prior work in spatial intelligence for aerial and legged robots, including visual-inertial state estimation, distributed SLAM, collaborative perception, multi-robot consistency optimization, and deployment on real hardware.

### 无人机集群 / Aerial Swarms

我们关注无 GPS 环境下的无人机集群状态估计、协同探索和自主运行。代表工作包括 Omni-Swarm、D2SLAM 和 RACER 等系统。

We study aerial swarm state estimation, collaborative exploration, and autonomous operation in GNSS-denied environments. Representative systems include Omni-Swarm, D2SLAM, and RACER.

### 具身智能与协同智能 / Embodied and Collaborative Intelligence

未来重点发力具身智能与协同智能，包括强化学习、Agent 行为决策、多模态大模型与物理机器人系统结合，以及面向机器人基础模型的数据与评测闭环。

Future work focuses on embodied and collaborative intelligence, including reinforcement learning, agent behavior decision-making, multimodal models integrated with physical robots, and data/evaluation loops for robot foundation models.

## 开源与系统 / Open Systems

已发布或参与发布的系统包括 D2SLAM、Omni-Swarm、VINS-Fisheye、FoxTracker 等。新一阶段课题组将继续坚持“算法必须能上真实机器人”的标准。

Released or contributed systems include D2SLAM, Omni-Swarm, VINS-Fisheye, and FoxTracker. The next stage will keep the standard that algorithms should run on real robots.
