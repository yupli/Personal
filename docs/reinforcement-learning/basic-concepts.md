# 第 1 课 · 基本概念 · V2（总结）

[切换到 V1（逐页）](basic-concepts-slides.md)

## 1. 状态、动作与环境反馈

- 状态（state）记录智能体（agent）当前所处的情形。网格中用 s₁ 到 s₉ 表示位置，构成状态空间（state space）𝒮。
- 动作空间（action space）𝒜(s) 是状态 s 下可选的指令。本例 a₁ 至 a₅ 依次为上、右、下、左、原地不动。
- 状态转移（state transition）由环境决定。p(s′ | s, a) 是给定当前状态和动作后到达 s′ 的概率。无风时 s₁ 向右必到 s₂，有风时则可能落在 s₂ 或 s₅。
- 奖励（reward）是一步得到的分数。p(r | s, a) 是给定状态和动作后得到 r 的概率。s₁ 向上撞墙与主动停留都会留在 s₁，奖励分别是 −1 和 0。

<figure>
  <img src="./resources/basic-concepts/grid-world.svg" alt="网格世界，s₆ 和 s₇ 是禁区，s₉ 是目标。" width="380" height="252">
  <figcaption>越界、进入或停在禁区得 −1，进入或主动停在目标格得 +1，其余得 0。禁区允许进入，所以 s₅ 向右会到 s₆。</figcaption>
</figure>

<details>
<summary>展开状态转移与奖励表</summary>

按当前状态查行、按动作查列。每格依次给出下一状态和即时奖励。

<table>
  <thead><tr><th scope="col">状态</th><th scope="col">a₁ ↑</th><th scope="col">a₂ →</th><th scope="col">a₃ ↓</th><th scope="col">a₄ ←</th><th scope="col">a₅ ○</th></tr></thead>
  <tbody>
    <tr><th scope="row">s₁</th><td>s₁，−1</td><td>s₂，0</td><td>s₄，0</td><td>s₁，−1</td><td>s₁，0</td></tr>
    <tr><th scope="row">s₂</th><td>s₂，−1</td><td>s₃，0</td><td>s₅，0</td><td>s₁，0</td><td>s₂，0</td></tr>
    <tr><th scope="row">s₃</th><td>s₃，−1</td><td>s₃，−1</td><td>s₆，−1</td><td>s₂，0</td><td>s₃，0</td></tr>
    <tr><th scope="row">s₄</th><td>s₁，0</td><td>s₅，0</td><td>s₇，−1</td><td>s₄，−1</td><td>s₄，0</td></tr>
    <tr><th scope="row">s₅</th><td>s₂，0</td><td>s₆，−1</td><td>s₈，0</td><td>s₄，0</td><td>s₅，0</td></tr>
    <tr><th scope="row">s₆</th><td>s₃，0</td><td>s₆，−1</td><td>s₉，+1</td><td>s₅，0</td><td>s₆，−1</td></tr>
    <tr><th scope="row">s₇</th><td>s₄，0</td><td>s₈，0</td><td>s₇，−1</td><td>s₇，−1</td><td>s₇，−1</td></tr>
    <tr><th scope="row">s₈</th><td>s₅，0</td><td>s₉，+1</td><td>s₈，−1</td><td>s₇，−1</td><td>s₈，0</td></tr>
    <tr><th scope="row">s₉</th><td>s₆，−1</td><td>s₉，−1</td><td>s₉，−1</td><td>s₈，0</td><td>s₉，+1</td></tr>
  </tbody>
</table>

</details>

## 2. 策略决定选哪个动作

策略（policy）π(a | s) 给出在 s 选择 a 的概率，同一状态下所有动作的概率之和为 1。

- 确定性策略（deterministic policy）给一个动作概率 1。例如 s₁ 总是向右。
- 随机策略（stochastic policy）给多个动作正概率。例如 s₁ 向右、向下各 0.5。

π(a | s) 描述选动作的随机性。p(s′ | s, a) 描述选定动作后落点的随机性。即使总选向右，风也可能让落点改变。

<details>
<summary>展开策略表</summary>

每格是选动作的概率。把 s₁ 行改为 (0, 1, 0, 0, 0)，就得到例子里的确定性策略。

<table>
  <thead><tr><th scope="col">状态</th><th scope="col">a₁ ↑</th><th scope="col">a₂ →</th><th scope="col">a₃ ↓</th><th scope="col">a₄ ←</th><th scope="col">a₅ ○</th></tr></thead>
  <tbody>
    <tr><th scope="row">s₁</th><td>0</td><td>0.5</td><td>0.5</td><td>0</td><td>0</td></tr>
    <tr><th scope="row">s₂</th><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
    <tr><th scope="row">s₃</th><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
    <tr><th scope="row">s₄</th><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><th scope="row">s₅</th><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
    <tr><th scope="row">s₆</th><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
    <tr><th scope="row">s₇</th><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><th scope="row">s₈</th><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><th scope="row">s₉</th><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
  </tbody>
</table>

</details>

## 3. 从单步奖励到整条轨迹的回报

轨迹（trajectory）按顺序记录状态、动作与奖励。回报（return）把一条轨迹上的奖励相加。

<figure>
  <img src="./resources/basic-concepts/grid-world-routes.svg" alt="两条从 s₁ 到 s₉ 的路线，路线 A 避开禁区，路线 B 经过 s₇。" width="620" height="280">
  <figcaption>两条路都在第四步到达目标。路线 A 的回报为 0 + 0 + 0 + 1 = 1，路线 B 在第二步进了禁区，回报为 0 − 1 + 0 + 1 = 0。</figcaption>
</figure>

同一策略可能产生多条轨迹。评价策略时要结合各条轨迹的回报和发生概率。

## 4. 回合、持续任务与折扣回报

从起点到终止状态（terminal state）的一次交互是一个回合（episode）。持续型任务（continuing task）没有规定在哪个状态停止。

- 把目标设为吸收状态（absorbing state），到达后永远留在该状态。若后续奖励设为 0，原回合的回报保持不变。
- 本课也考虑把 s₉ 当作普通状态。到达后仍可选动作，若一直停留且每次得 +1，未折扣的奖励总和会发散。

折扣回报（discounted return）从时刻 t 开始加总未来奖励。下一步奖励 Rₜ₊₁ 的权重为 1，以后每一步多乘一个折扣因子（discount factor）γ，其中 0 ≤ γ < 1。

> Gₜ = Rₜ₊₁ + γRₜ₊₂ + γ²Rₜ₊₃ + …

路线 A 第四步首次得 +1，之后每步都得 +1，所以 G₀ = γ³ + γ⁴ + … = γ³ / (1 − γ)。当 γ = 0.5 时，G₀ = 0.25。γ 越接近 1，远期奖励的权重衰减越慢。奖励有界时，折扣总和有限。

## 5. 马尔可夫决策过程

马尔可夫决策过程（Markov decision process，MDP）描述状态空间 𝒮、各状态可选的动作 𝒜(s)，以及执行动作后下一状态和奖励的概率。策略 π(a | s) 决定怎样在这个环境中选动作。

马尔可夫性质（Markov property）要求给定当前状态和动作后，更早的历史不会改变下一状态与奖励的概率。例如，无论从上方还是左侧到达 s₅，接下来向右都会进 s₆ 并扣 1 分。

<figure>
  <img src="./resources/basic-concepts/markov-chain.svg" alt="固定策略后，s₁ 分别以 0.5 的概率转移到 s₂ 或 s₄，两条分支在 s₅ 汇合。" width="620" height="270">
  <figcaption>固定策略后，把动作概率与其转移概率相乘。从 s₁ 选向右的概率是 0.5，选中后必到 s₂，所以这条边的概率是 0.5 × 1 = 0.5。</figcaption>
</figure>

多个动作通往同一状态时，将各自的概率贡献相加。固定一套只依赖当前状态的策略后，状态序列构成马尔可夫过程（Markov process）。
