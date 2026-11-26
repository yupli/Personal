---
pageClass: rl-summary
---

# 第 8 课 · 价值函数近似 · V2（总结）

## 1. Motivating Example · Curve Fitting {#curve-fitting}

### 1.1 从表格到共享参数

<div class="td-slide">
<div class="td-slide-title">Tabular Representation · 每个状态动作对有一格</div>
<div class="td-slide-body">

前七课用表格存储 **state value** 和 **action value**。以 $q_\pi$ 为例，行对应状态，列对应动作，每格存一个 $q_\pi(s,a)$。课件中 9 个状态、每个状态 5 个动作，共有 45 个表项。

**优点（Advantage）**

查表直观，逐项更新也容易分析。

**缺点（Disadvantages）**

- **Storage**。状态或动作越多，需要的表项越多。连续空间无法逐项列成有限表。
- **Generalization**。表项各自独立，更新一个表项时，其他表项的估计不会随之改变。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Curve Fitting · 用一条曲线表示多个状态的价值</div>
<div class="td-slide-body">

固定策略 $\pi$，把一维状态及其价值看成数据点 $(s,v_\pi(s))$。状态很多时，可以用同一个 **parameterized function** $\hat v(s,w)$ 来拟合这些点。

</div>
</div>

### 1.2 Linear in Parameters

<div class="td-slide">
<div class="td-slide-title">Polynomial Features · 直线与二次曲线</div>
<div class="td-slide-body">

直线用 $\phi(s)=[1,s]^\top$，二次曲线用 $\phi(s)=[1,s,s^2]^\top$。两者都可以写成

$$
\hat v(s,w)=\phi(s)^\top w.
$$

- $w\in\mathbb R^m$ 是 **parameter vector**，存放要学习的系数。
- $\phi(s)\in\mathbb R^m$ 是状态 $s$ 的 **feature vector**，存放用来表示该状态的特征。

加入 $s^2$ 后，曲线可以弯曲。这里的 **linear** 指对参数 $w$ 线性，feature 本身可以是状态的非线性函数。

</div>
</div>

### 1.3 Quick Summary

<div class="td-slide">
<div class="td-slide-title">Value Function Approximation · Storage 与 Generalization</div>
<div class="td-slide-body">

用 $\hat v(s,w)\approx v_\pi(s)$ 近似状态价值，也可以用 $\hat q(s,a,w)$ 近似动作价值。

- **Storage**。对状态价值而言，参数维数 $m$ 可以远小于状态数 $|\mathcal S|$。
- **Generalization**。从一个已访问状态得到的经验会更新共享参数 $w$，也可能改变其他尚未访问状态的价值估计。

</div>
</div>

## 2. Objective Function {#objective-function}

### 2.1 Weighted Value Error {#_2-1-weighted-value-error}

<div class="td-slide">
<div class="td-slide-title">Policy Evaluation · 要找怎样的参数？</div>
<div class="td-slide-body">

固定策略 $\pi$，用 $\hat v(s,w)$ 近似真实的 **state value** $v_\pi(s)$。我们要找一组参数 $w$，让它在整个状态空间上的近似误差尽可能小。这是 **policy evaluation**，后面再扩展到 **policy improvement**。

1. 本节定义 **objective function**，衡量近似误差。
2. 下一节从这个目标出发，推导参数更新算法。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Objective · 最小化平方误差</div>
<div class="td-slide-body">

令随机状态 $S\sim d$，寻找使下式最小的 $w$。

$$
J(w)=\frac12\mathbb E_{S\sim d}
\big[(v_\pi(S)-\hat v(S,w))^2\big].
$$

前面的 $1/2$ 方便下一节求导，最优参数与课件中的写法相同。分布 $d$ 决定各状态的误差在目标里占多大权重。

</div>
</div>

### 2.2 Uniform Distribution {#uniform-distribution}

<div class="td-slide">
<div class="td-slide-title">Uniform Distribution · 每个状态权重相同</div>
<div class="td-slide-body">

若有限状态集 $\mathcal S$ 上的每个状态都取概率 $1/|\mathcal S|$，则

$$
J(w)=\frac{1}{2|\mathcal S|}
\sum_{s\in\mathcal S}(v_\pi(s)-\hat v(s,w))^2.
$$

**缺点**。策略 $\pi$ 对各状态的访问频率可能相差很大，均匀权重会让罕见状态和常见状态同样影响拟合。

</div>
</div>

### 2.3 Stationary Distribution {#_2-2-stationary-distribution}

<div class="td-slide">
<div class="td-slide-title">Stationary Distribution · 按长期访问频率加权</div>
<div class="td-slide-body">

令 $d_\pi(s)$ 表示策略 $\pi$ 诱导的 Markov chain 的 stationary distribution。它满足 $d_\pi(s)\ge 0$，且 $\sum_{s\in\mathcal S}d_\pi(s)=1$。用它给误差加权，得到

$$
J(w)=\frac12\sum_{s\in\mathcal S}
d_\pi(s)(v_\pi(s)-\hat v(s,w))^2.
$$

在遍历条件下，常访问的状态有更大的 $d_\pi(s)$，对拟合结果的影响也更大。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Stationary Equation · 一步转移后分布保持不变</div>
<div class="td-slide-body">

记 $P_\pi(s,s')$ 为按 $\pi$ 从 $s$ 转移到 $s'$ 的概率。把 $d_\pi^\top$ 写成行向量，平稳条件是

$$
d_\pi^\top=d_\pi^\top P_\pi.
$$

右侧第 $s'$ 项是 $\sum_s d_\pi(s)P_\pi(s,s')$，即一步转移后落在 $s'$ 的总概率。它等于原来的 $d_\pi(s')$，因此状态分布保持不变。

对有限、不可约且非周期的 Markov chain，任意初始分布经过足够多步都会趋近唯一的 $d_\pi$。沿一条长轨迹统计各状态的访问比例，也会趋近相应的 $d_\pi(s)$。

</div>
</div>

## 3. Optimization Algorithms {#td-function-approximation}

### 3.1 从 Gradient Descent 到 SGD {#_3-1-从-sgd-到-semi-gradient-td}

<div class="td-slide">
<div class="td-slide-title">Gradient Descent · 对目标函数求导</div>
<div class="td-slide-body">

对第 2 节的目标 $J(w)$ 做 **gradient descent**。

$$
w_{k+1}=w_k-\alpha_k\nabla_w J(w_k).
$$

令 $e(s,w)=v_\pi(s)-\hat v(s,w)$。固定策略下，$v_\pi$ 与状态分布 $d$ 都不随 $w$ 变化。对平方误差应用 chain rule，得到

$$
\begin{aligned}
\nabla_w J(w)
&=\mathbb E_d[e(S,w)\nabla_w e(S,w)]\\
&=-\mathbb E_d[e(S,w)\nabla_w\hat v(S,w)].
\end{aligned}
$$

第 2 节的 $1/2$ 抵消了平方求导产生的 $2$。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">SGD · 用一个状态替代期望</div>
<div class="td-slide-body">

用状态样本 $s_t$ 计算 **stochastic gradient**，得到

$$
\begin{aligned}
w_{t+1}&=w_t+\alpha_t e(s_t,w_t)
  \nabla_w\hat v(s_t,w_t).
\end{aligned}
$$

这一步仍需要待估计的真实价值 $v_\pi(s_t)$。实际更新可以用下面两种 **target** 来代替它。

</div>
</div>

### 3.2 Monte Carlo 与 TD Learning

<div class="td-slide">
<div class="td-slide-title">Monte Carlo · 用完整 Return 作 Target</div>
<div class="td-slide-body">

按 $\pi$ 生成一个 episode 后，取从 $s_t$ 开始的 discounted return $g_t$ 作为 $v_\pi(s_t)$ 的样本。

$$
\begin{aligned}
e_t^{\mathrm{MC}}&=g_t-\hat v(s_t,w_t),\\
w_{t+1}&=w_t+\alpha_t e_t^{\mathrm{MC}}
  \nabla_w\hat v(s_t,w_t).
\end{aligned}
$$

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">TD Update · 用单步 Target 替换未知价值</div>
<div class="td-slide-body">

沿用第七课的 TD target，只需一条转移 $(s_t,r_{t+1},s_{t+1})$。

$$
\begin{aligned}
y_t&=r_{t+1}+\gamma\hat v(s_{t+1},w_t),\\
\delta_t&=y_t-\hat v(s_t,w_t),\\
w_{t+1}&=w_t+\alpha_t\delta_t\nabla_w\hat v(s_t,w_t).
\end{aligned}
$$

本次更新把 $y_t$ 当作常数，只对当前预测求导，因此叫 **semi-gradient**。终止转移取 $y_t=r_{t+1}$。

</div>
</div>

### 3.3 TD Learning Pseudocode

<div class="td-slide">
<div class="td-slide-title">Pseudocode · TD Learning with Function Approximation</div>
<div class="td-slide-body">

**Initialization**。选定对 $w$ 可微的 $\hat v(s,w)$ 和初始参数 $w_0$。目标是近似给定策略 $\pi$ 的 state values。

1. 按 $\pi$ 生成 episode。每收到一条转移 $(s_t,r_{t+1},s_{t+1})$，就计算本步的 target 和 TD error $\delta_t$。
2. 用 $w_{t+1}=w_t+\alpha_t\delta_t\nabla_w\hat v(s_t,w_t)$ 更新参数，再处理下一条转移。

**Linear case**。若 $\hat v(s,w)=\phi(s)^\top w$，则 gradient 等于 $\phi(s_t)$，更新写成

$$
\begin{aligned}
y_t&=r_{t+1}+\gamma\phi(s_{t+1})^\top w_t,\\
\delta_t&=y_t-\phi(s_t)^\top w_t,\\
w_{t+1}&=w_t+\alpha_t\delta_t\phi(s_t).
\end{aligned}
$$

终止转移同样取 $y_t=r_{t+1}$。

</div>
</div>

## 4. Function Approximators and Gridworld {#linear-features}

### 4.1 Linear TD 与 Tabular TD

<div class="td-slide">
<div class="td-slide-title">Linear TD · Gradient 就是 Feature Vector</div>
<div class="td-slide-body">

用线性模型时，$\nabla_w\hat v(s,w)=\phi(s)$，所以 $w_{t+1}=w_t+\alpha_t\delta_t\phi(s_t)$。如果 $\phi(s)$ 是状态的 **one-hot vector**，每次只改该状态的一个参数，得到第七课的 tabular TD。

也可以用 **neural network** 直接学习非线性的 $\hat v(s,w)$，用 backpropagation 计算 gradient。

</div>
</div>

### 4.2 Gridworld · Feature 决定可以拟合的形状

<div class="td-slide">
<div class="td-slide-title">5×5 Gridworld · 用平面拟合价值曲面</div>
<div class="td-slide-body">

以坐标 $(x,y)$ 表示状态，$\phi(s)=[1,x,y]^\top$ 只需要三个参数，预测值构成一个平面。课件图中，TD-Linear 学到了价值变化的大致方向，但误差在训练后趋于平稳。

<figure>
  <img src="./resources/value-function-approximation/td-linear-plane.webp" alt="左侧是真实价值曲面，中间是 TD-Linear 的平面近似，右侧是按 episode 显示的 RMSE。" loading="lazy">
</figure>

加入 $x^2,y^2,xy$ 后可拟合二次曲面。课件继续比较了 6 维和 10 维 feature，展示了增加 feature 如何改善这组实验里的拟合。线性 TD 求解的方程见[附录](appendix.md#linear-td-projected-bellman-equation)。

</div>
</div>

## 5. Sarsa and Q-learning with Function Approximation {#approximate-control}

### 5.1 Sarsa · 用采样到的下一动作

<div class="td-slide">
<div class="td-slide-title">Semi-gradient Sarsa · 从 State Value 换成 Action Value</div>
<div class="td-slide-body">

用 $\hat q(s,a,w)$ 表示 action value。按当前策略采样 $a_{t+1}$，定义

$$
y_t=r_{t+1}+\gamma\hat q(s_{t+1},a_{t+1},w_t).
$$

把误差 $\delta_t=y_t-\hat q(s_t,a_t,w_t)$ 乘当前预测的 gradient，得到

$$
w_{t+1}=w_t+\alpha_t\delta_t\nabla_w\hat q(s_t,a_t,w_t).
$$

做 control 时，用当前 $\hat q$ 构造 $\varepsilon$-greedy policy，继续采样和更新。

</div>
</div>

### 5.2 Q-learning · 用下一状态的最大动作值

<div class="td-slide">
<div class="td-slide-title">Semi-gradient Q-learning · Greedy Target</div>
<div class="td-slide-body">

参数更新沿用上一小节的形式。Q-learning 的 target 为

$$
y_t=r_{t+1}+\gamma\max_b\hat q(s_{t+1},b,w_t).
$$

两种算法在终止转移都只用即时奖励。Gridworld 实验沿用第七课的指标，用每回合 total reward、episode length 和学到的 greedy policy 检查控制效果。共享参数让一次更新可以影响多个状态动作对。

</div>
</div>

## 6. Deep Q-learning {#deep-q-learning}

### 6.1 Online Network 与 Target Network

<div class="td-slide">
<div class="td-slide-title">DQN Loss · 用暂时固定的 Target 拟合动作价值</div>
<div class="td-slide-body">

DQN 用神经网络近似 $q^*$。令 $w$ 为 **online network** 的参数，$w^-$ 为 **target network** 的参数。

$$
\begin{aligned}
y &= r+\gamma\max_b\hat q(s',b,w^-),\\
L(w)&=\mathbb E[(y-\hat q(s,a,w))^2].
\end{aligned}
$$

终止转移令 $y=r$。训练时固定 $w^-$，只更新 $w$，每隔 $C$ 次更新把 $w$ 复制给 $w^-$。这样连续几步使用同一套 target 参数。

</div>
</div>

### 6.2 Experience Replay

<div class="td-slide">
<div class="td-slide-title">Replay Buffer · 随机抽取 Mini-batch</div>
<div class="td-slide-body">

把每条经验存进 **replay buffer**，训练时均匀抽取 mini-batch。这样可以复用旧转移，也能减弱连续轨迹中相邻样本的相关性。抽样分布由 buffer 里的数据决定，哪些状态动作对能被学到仍取决于数据覆盖。

</div>
</div>

### 6.3 Algorithm and Gridworld Example

<div class="td-slide">
<div class="td-slide-title">Pseudocode · Deep Q-learning</div>
<div class="td-slide-body">

1. 初始化 online network，复制参数到 target network。
2. 用探索性 behavior policy 收集转移，存入 replay buffer。课件示例使用预先采集的轨迹。
3. 每次均匀抽取一个 mini-batch，用 target network 计算 $y$，以平方误差更新 online network。
4. 每隔 $C$ 次更新同步参数。需要输出策略时，从 online network 取 greedy action。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Gridworld · 1,000 步与 100 步的覆盖</div>
<div class="td-slide-body">

课件用同一个 5×5 Gridworld 比较两条长度不同的轨迹。1,000 步轨迹覆盖较广，学到的策略更接近最优。100 步轨迹覆盖不足，即使训练 loss 已很低，整体价值估计仍有明显误差。

<figure>
  <img src="./resources/value-function-approximation/dqn-1000-steps.webp" alt="1,000 步轨迹覆盖较广，训练后策略和状态价值误差均得到改善。" loading="lazy">
  <figcaption>1,000 步轨迹</figcaption>
</figure>

<figure>
  <img src="./resources/value-function-approximation/dqn-100-steps.webp" alt="100 步轨迹的覆盖有限，TD loss 降低后状态价值 RMSE 仍有明显残差。" loading="lazy">
  <figcaption>100 步轨迹</figcaption>
</figure>

</div>
</div>

[Shiyu Zhao · Lecture 8 原课件](https://github.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning/blob/main/Lecture%20slides/slidesForMyLectureVideos/L8_Value%20function%20approximation.pdf)
