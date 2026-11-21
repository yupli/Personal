---
pageClass: rl-summary
---

# 第 1 课 · 基本概念 · V2（总结）

[切换到 V1（逐页）](basic-concepts-slides.md)

## 1. States, Actions & Transitions

### （1）状态与状态空间

- **State（状态）**：智能体（agent）相对于环境所处的情形，记作 $s$。
- **State space（状态空间）**：所有可能状态的集合，记作 $\mathcal S$，因此 $s\in\mathcal S$。若有 $N$ 个状态，可写成 $\mathcal S=\{s_1,\ldots,s_N\}$。

### （2）动作与动作空间

- **Action（动作）**：智能体在当前状态下可以做出的一项选择，记作 $a$。
- **Action space of a state（该状态的动作空间）**：状态 $s$ 下所有可用动作的集合，记作 $\mathcal A(s)$。智能体在状态 $s$ 选择的动作满足 $a\in\mathcal A(s)$。不同状态的可用动作可以不同。

### （3）状态转移与转移概率

**State transition（状态转移）**：智能体在状态 $s$ 执行动作 $a$ 后，环境产生下一状态 $s'$，记作 $s\xrightarrow{a}s'$。下一状态也可能仍是 $s$。

**State transition probability（状态转移概率）**：给定当前状态 $s$ 和动作 $a$，下一状态是 $s'$ 的概率。

$$
p(s'\mid s,a)=\Pr(S_{t+1}=s'\mid S_t=s,A_t=a),
\qquad \sum_{s'\in\mathcal S}p(s'\mid s,a)=1.
$$

- **Deterministic transition（确定性转移）**：给定 $(s,a)$ 后，只有一个下一状态的概率为 $1$，其余为 $0$。
- **Stochastic transition（随机转移）**：即使给定同一个 $(s,a)$，也可能出现多个不同的下一状态，概率分配在这些状态上。

环境同时给出下一状态 $s'$ 和即时奖励 $r$，可用联合分布（joint distribution）$p(s',r\mid s,a)$ 描述。离散情形下，对奖励求和得到状态转移概率；对下一状态求和得到奖励概率：

$$
p(s'\mid s,a)=\sum_r p(s',r\mid s,a),
\qquad
p(r\mid s,a)=\sum_{s'}p(s',r\mid s,a).
$$

## 2. Policy

策略 $\pi(a\mid s)$ 给出在状态 $s$ 选动作 $a$ 的概率，满足 $\sum_a\pi(a\mid s)=1$。

- <strong>Deterministic policy</strong> 在每个状态把全部概率给一个动作。
- <strong>Stochastic policy</strong> 可以把概率分给多个动作。

$\pi(a\mid s)$ 决定选什么，$p(s'\mid s,a)$ 决定选定后到哪里。固定当前状态后，先选 $a$ 再到达 $s'$ 的概率是两项的乘积。

## 3. Rewards, Trajectories & Returns

轨迹（trajectory）按时间记录状态、动作和奖励。即时奖励 $R_{t+1}$ 只描述执行 $A_t$ 的结果。折扣回报（discounted return）$G_t$ 累计从这一动作开始的全部奖励：

$$
G_t=R_{t+1}+\gamma R_{t+2}+\gamma^2R_{t+3}+\cdots.
$$

第一笔奖励权重为 1，此后每晚一步就多乘一个折扣因子 $\gamma$。$\gamma=0$ 时只计第一步，$\gamma$ 越接近 1，远期奖励衰减越慢。若 $|R_t|\le R_{\max}$ 且 $0\le\gamma<1$，则 $|G_t|\le R_{\max}/(1-\gamma)$。

## 4. Episodic & Continuing Tasks

回合型任务（episodic task）到终止状态或任务规定的终点结束。若在时刻 $T$ 终止，最后一笔奖励是 $R_T$，且 $G_T=0$。持续型任务（continuing task）没有规定的回合终点，继续计算后续奖励。

把终止状态表示为吸收状态（absorbing state）时，可让它只转移到自己，并把终止后的所有奖励设为 0。这样补出的后续交互不改变原回报。

## 5. Markov Decision Process (MDP)

<strong>马尔可夫性质（Markov property）</strong>要求给定当前状态和动作后，下一状态与奖励的条件分布不再依赖更早的历史。MDP 把状态空间、动作集合、环境的转移与奖励规则和折扣因子组织在一起。

固定只依赖当前状态的策略后，对动作求和就得到状态之间的一步转移概率：

$$
p_\pi(s'\mid s)=\sum_a\pi(a\mid s)\,p(s'\mid s,a).
$$

每一项对应一个可能的动作路径。把所有路径的概率相加后，状态序列构成马尔可夫过程（Markov process）。第 2 课用这个转移概率推导 Expected Future Return。
