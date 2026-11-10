# 第 1 课 · 基本概念

机器人在 3×3 网格里从任意起点出发，目标是到达右下角，同时尽量避开禁区、减少绕路和无效的撞墙动作。沿着这个例子，可以看清智能体如何做决策，以及怎样用回报评价决策的结果。

## 1. 状态、动作与环境反馈

**状态（state）**：智能体相对于环境所处的情形。网格的九个位置按行编号为 s₁ 到 s₉；s₆、s₇ 是禁区，s₉ 是目标，其余为可通行格，外框是边界。格子编号只是索引，也可以用二维坐标 (x, y) 表示位置。更复杂的机器人还可能需要速度、加速度等状态信息。所有可能的状态组成状态空间（state space）𝒮 = {s₁, …, s₉}。

**动作（action）**：智能体能发出的指令。网格里 a₁、a₂、a₃、a₄、a₅ 分别是向上、向右、向下、向左和原地不动，不能斜走。动作空间（action space）𝒜(s) 是状态 s 下可选的动作集合；本例各格提供同样的五个动作，其他问题中可以随状态而变。

<figure>
  <img src="./resources/basic-concepts/interaction.svg" alt="状态经策略选出动作，环境产生下一状态和奖励，下一状态用于下一步决策。" width="620" height="210">
  <figcaption>一次交互中，策略负责选动作，环境负责产生下一状态和奖励。</figcaption>
</figure>

**状态转移（state transition）**：环境执行动作后给出下一状态。s₁ 向右到 s₂，向上撞墙仍留在 s₁。仿真也可以规定撞墙后弹到 s₄ 或 s₇；真实机器人能到哪里受物理条件约束。禁区有两种建模方式：把它当成墙，s₅ 向右会留在 s₅；允许进入但扣分，s₅ 向右就会到 s₆。课程采用后一种，允许智能体权衡绕远与穿过禁区的代价；若直接排除禁区，可达的搜索范围会缩小。

**奖励（reward）**：执行动作后收到的一个实数。最大化回报时，正数鼓励、负数惩罚、零表示这一步没有奖惩，相对于受惩罚的动作仍更可取。也可以把正数定义成代价并改为最小化总成本。奖励是设计者把期望行为告诉智能体的方式。

这个网格里，试图越界得 −1，进入或停留在禁区得 −1，到达或留在目标格得 +1，其余情况得 0。比如在 s₁，向上撞墙和主动停留都不会改变状态，但奖励分别为 −1 和 0。只知道下一状态，未必就能知道这一步的奖励。

<details>
<summary>展开状态转移与奖励表</summary>

每行是当前状态，每列是选定动作。单元格依次给出下一状态、即时奖励，适用于每个状态和动作都有唯一结果的情形。

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

结果有随机性时，用条件概率（conditional probability）替代单一表值：

- **状态转移概率（state transition probability）**：p(s′ | s, a) 表示在 s 执行 a 后到达 s′ 的概率。无风时，s₁ 向右到 s₂ 的概率为 1，其他落点为 0；有风时，同一动作可能各以 0.5 的概率落在 s₂ 或 s₅。
- **奖励概率（reward probability）**：p(r | s, a) 表示在 s 执行 a 后得到 r 的概率。s₁ 向上时得到 −1 的概率为 1，其他奖励的概率为 0；随机情形可以始终有正向反馈，但大小不确定，例如努力学习通常会有收获，收获多少还受其他因素影响。

## 2. 策略决定选哪个动作

**策略（policy）**：π(a | s) 是在状态 s 选择动作 a 的概率。一个完整策略为每个状态都规定动作分布，同一状态下各动作概率之和为 1。

- **确定性策略（deterministic policy）**：每个状态只选一个动作，其概率为 1。在 s₁ 总是向右时，从 s₁、s₃ 和 s₇ 出发分别得到 s₁ → s₂ → s₅ → s₈ → s₉、s₃ → s₂ → s₅ → s₈ → s₉ 和 s₇ → s₈ → s₉。到达目标后按策略停留。
- **随机策略（stochastic policy）**：同一状态有多个动作的概率为正。若只把 s₁ 改为向右、向下各 0.5，从 s₁ 出发既可能经 s₂，也可能经 s₄；两条路径都在 s₅ 汇合。实现时可以在 [0, 1) 均匀抽样，前半段选 a₂，后半段选 a₃。

<details>
<summary>展开策略表</summary>

表格的行列与转移表相同，但每个格子填写动作概率。下表的 s₁ 是随机选择，其余状态仍是确定性选择；把 s₁ 行改为 (0, 1, 0, 0, 0)，就得到上面的确定性策略。程序中可以用数组或矩阵保存这张表。

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

策略的随机性来自「选什么动作」，环境的随机性来自「选定后得到什么结果」。例如，固定向右也可能被风吹到另一格；没有风时，随机选向右或向下也会走出不同路径。

## 3. 从单步奖励到整条轨迹的回报

**轨迹（trajectory）**：把连续交互的状态、动作、奖励依次串起来。**回报（return）** 是沿轨迹收集到的奖励总和；同一起点采用不同策略，可以走出不同轨迹并得到不同回报。

<figure>
  <img src="./resources/basic-concepts/grid-world-routes.svg" alt="两条从 s₁ 到 s₉ 的路线：A 经 s₂、s₅、s₈；B 经 s₄、s₇、s₈。" width="620" height="280">
  <figcaption>两条路线都走四步，只有路线 B 经过黄色禁区。</figcaption>
</figure>

- **路线 A**：s₁ → s₂ → s₅ → s₈ → s₉，动作依次为 a₂、a₃、a₃、a₂。回报为 0 + 0 + 0 + 1 = 1。
- **路线 B**：s₁ → s₄ → s₇ → s₈ → s₉，动作依次为 a₃、a₃、a₂、a₂。回报为 0 − 1 + 0 + 1 = 0。

路线 A 和 B 同样到达目标，但 A 没有踩进禁区。回报把这项直观差异变成了数值。随机策略或随机环境可能产生多条轨迹，评价策略时还要考虑各条轨迹出现的概率。

## 4. 回合、持续任务与折扣回报

**回合（episode / trial）**：从起点交互到终止状态（terminal state）的一条轨迹，通常是有限的。若到达 s₉ 就停，路线 A 和 B 各构成一个回合。这类问题称为回合型任务（episodic task）。持续型任务（continuing task）没有终止状态；现实中长期运行的任务也可用它近似。

可把到达目标后的行为也纳入持续模型：

- **吸收状态（absorbing state）**：进入目标后，无论选什么动作都留在该状态，也可以只保留「原地不动」这个动作。到达之后的奖励设为 0，补上的步数不改变原回合的回报。
- **普通状态（ordinary state）**：到达目标后仍按策略行动，可以离开，也可以停留并继续获得目标奖励。课程采用这种设定，对目标与其他状态使用同一套规则，代价是要搜索的行为更多。

如果走路线 A 到达 s₉ 后一直选择 a₅，并且每次停留仍得 +1，奖励序列就是 0, 0, 0, 1, 1, …，未折扣总和会发散。引入折扣因子（discount factor）γ 后，未来第 k 步的奖励乘以 γ 的 k−1 次方：

> 折扣回报（discounted return）Gₜ = Rₜ₊₁ + γRₜ₊₂ + γ²Rₜ₊₃ + …，其中 0 ≤ γ < 1。

在这个例子中，前三项为零，第四步第一次得到 +1，所以 G₀ = γ³ + γ⁴ + … = γ³(1 + γ + γ² + …) = γ³ / (1 − γ)。奖励有界时，折扣使无限和保持有限。γ 越小，远期奖励衰减越快；γ 越接近 1，远期奖励相对越有分量，因而改变 γ 也可能改变学到的策略。

## 5. 马尔可夫决策过程

**马尔可夫决策过程（Markov decision process, MDP）**：用状态集合 𝒮、各状态的动作集合 𝒜(s)、每组状态和动作可能得到的奖励集合 ℛ(s, a)，以及环境的转移概率 p(s′ | s, a) 和奖励概率 p(r | s, a)，描述决策所处的环境。策略 π(a | s) 则给出如何在这个环境中做决定。

**马尔可夫性质（Markov property）**：给定当前状态 s 和所选动作 a，再知道更早的交互历史，也不会改变对下一状态和即时奖励的概率判断。这就是无记忆性（memorylessness）。例如，机器人从哪条路来到 s₅，不会改变它从 s₅ 向右时的结果。如果过去的某条信息会改变结果，就需要把它纳入状态。

令 Hₜ 表示当前状态之前的交互历史，这两种条件概率分别满足：

- p(sₜ₊₁ | sₜ, aₜ, Hₜ) = p(sₜ₊₁ | sₜ, aₜ)
- p(rₜ₊₁ | sₜ, aₜ, Hₜ) = p(rₜ₊₁ | sₜ, aₜ)

<figure>
  <img src="./resources/basic-concepts/markov-chain.svg" alt="固定策略后的网格状态图：从 s₁ 以各 0.5 的概率到 s₂ 或 s₄，两支在 s₅ 汇合，再经 s₈ 到 s₉。" width="620" height="270">
  <figcaption>固定策略后，圆圈表示状态，箭头和数字表示状态之间的转移及其概率。</figcaption>
</figure>

固定策略后，在每个状态选动作的概率已知，可以把动作对应的转移按这些概率加权，得到状态间的转移概率。网格中 s₁ 各以 0.5 的概率向右、向下，环境执行动作是确定的，因此状态图里 s₁ → s₂ 和 s₁ → s₄ 的概率各为 0.5。此时只看状态序列，就得到一个马尔可夫过程（Markov process）。
