---
pageClass: rl-summary
outline: [2, 3]
---

# 第 8 课 · 价值函数近似

## 1. Motivating Example · Curve Fitting {#curve-fitting}

#### 1.1 从表格到共享参数

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

#### 1.2 Linear in Parameters

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

#### 1.3 Quick Summary

<div class="td-slide">
<div class="td-slide-title">Value Function Approximation · Storage 与 Generalization</div>
<div class="td-slide-body">

用 $\hat v(s,w)\approx v_\pi(s)$ 近似状态价值，也可以用 $\hat q(s,a,w)$ 近似动作价值。

- **Storage**。对状态价值而言，参数维数 $m$ 可以远小于状态数 $|\mathcal S|$。
- **Generalization**。从一个已访问状态得到的经验会更新共享参数 $w$，也可能改变其他尚未访问状态的价值估计。

</div>
</div>

## Algorithm for state value estimation {#algorithm-for-state-value-estimation}

### 2. Objective Function {#objective-function}

#### 2.1 Weighted Value Error {#_2-1-weighted-value-error}

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

#### 2.2 Uniform Distribution {#uniform-distribution}

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

#### 2.3 Stationary Distribution {#_2-2-stationary-distribution}

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

### 3. Optimization Algorithms {#td-function-approximation}

#### 3.1 从 Gradient Descent 到 SGD {#_3-1-从-sgd-到-semi-gradient-td}

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

#### 3.2 Monte Carlo 与 TD Learning

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

#### 3.3 TD Learning Pseudocode

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

### 4. Selection of Function Approximators {#linear-features}

#### 4.1 Linear 与 Nonlinear Approximators

<div class="td-slide">
<div class="td-slide-title">两种 Approximator · 怎样选择模型？</div>
<div class="td-slide-body">

- **Linear function**。用 $\hat v(s,w)=\phi(s)^\top w$。Feature vector $\phi(s)$ 可由 **polynomial basis** 或 **Fourier basis** 构成。第 1 节的直线和二次曲线都属于这种形式。
- **Neural network**。输入状态 $s$，输出价值估计 $\hat v(s,w)$，网络参数为 $w$。网络可以表示非线性的价值函数，gradient 可由 backpropagation 计算。

</div>
</div>

#### 4.2 TD-Linear

<div class="td-slide">
<div class="td-slide-title">TD-Linear · Gradient 等于 Feature Vector</div>
<div class="td-slide-body">

对 $\hat v(s,w)=\phi(s)^\top w$ 求导，得到 $\nabla_w\hat v(s,w)=\phi(s)$。代入第 3 节的 semi-gradient TD 更新，得到 **TD-Linear**。

$$
\begin{aligned}
y_t&=r_{t+1}+\gamma\phi(s_{t+1})^\top w_t,\\
\delta_t&=y_t-\phi(s_t)^\top w_t,\\
w_{t+1}&=w_t+\alpha_t\delta_t\phi(s_t).
\end{aligned}
$$

终止转移取 $y_t=r_{t+1}$。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Linear Approximation · 优点与缺点</div>
<div class="td-slide-body">

**缺点（Disadvantage）**

合适的 feature vector 往往难选。训练只能调整已有特征的系数。

**优点（Advantages）**

- Linear TD 的收敛性质更容易分析。
- **Tabular representation** 是 linear function approximation 的一个特例。

</div>
</div>

#### 4.3 Tabular TD 是 TD-Linear 的特例 {#_4-1-linear-td-与-tabular-td}

<div class="td-slide">
<div class="td-slide-title">One-hot Features · 每个状态选中一个表项</div>
<div class="td-slide-body">

令 $\phi(s)=e_s\in\mathbb R^{|\mathcal S|}$，其中 $e_s$ 对应状态 $s$ 的分量为 $1$，其余分量为 $0$。于是

$$
\hat v(s,w)=e_s^\top w=w(s).
$$

代入 TD-Linear 后，普通转移的 TD error 为 $\delta_t=r_{t+1}+\gamma w_t(s_{t+1})-w_t(s_t)$，而向量更新是 $w_{t+1}=w_t+\alpha_t\delta_t e_{s_t}$。

两边左乘 $e_{s_t}^\top$，就只读出状态 $s_t$ 的分量。

$$
w_{t+1}(s_t)=w_t(s_t)+\alpha_t\delta_t.
$$

只有当前状态的表项被更新，这就是 **tabular TD**。

</div>
</div>

<span id="_4-2-gridworld-·-feature-决定可以拟合的形状"></span>

#### 4.4 Summary {#value-approximation-summary}

<div class="td-slide">
<div class="td-slide-title">Summary · 从 Policy Evaluation 到 Semi-gradient TD</div>
<div class="td-slide-body">

1. **Objective**。固定 $\pi$，用 $J(w)=\frac12\mathbb E_d[(v_\pi(S)-\hat v(S,w))^2]$ 衡量价值近似的误差。
2. **SGD**。对样本 $s_t$，用误差 $v_\pi(s_t)-\hat v(s_t,w_t)$ 乘 $\nabla_w\hat v(s_t,w_t)$ 来更新参数。
3. **Semi-gradient TD**。真实价值未知，用 $r_{t+1}+\gamma\hat v(s_{t+1},w_t)$ 替代 $v_\pi(s_t)$，更新时把这个 target 当作常数。

这三步解释了 TD 更新的来由。换成含当前估计的 TD target 后，更新方向一般会偏离 $J(w)$ 的负梯度。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Theoretical Analysis · 三种误差</div>
<div class="td-slide-body">

令 $\hat v(w)$ 表示所有状态的价值估计，$D=\operatorname{diag}(d_\pi)$，$\|x\|_D^2=x^\top D x$。Bellman operator 为 $T_\pi x=r_\pi+\gamma P_\pi x$。

**True Value Error** 衡量估计与真实价值的差距。在 $d=d_\pi$ 时，$J_E(w)=2J(w)$。

$$
J_E(w)=\|\hat v(w)-v_\pi\|_D^2.
$$

**Bellman Error** 比较当前估计与一次 Bellman backup 的结果。

$$
J_{\mathrm{BE}}(w)=\|\hat v(w)-T_\pi\hat v(w)\|_D^2.
$$

**Projected Bellman Error** 先将 backup 的结果投影回线性模型能表示的空间，再比较。$\Pi_D$ 是按 $D$ 加权的正交投影。

$$
J_{\mathrm{PBE}}(w)
=\|\hat v(w)-\Pi_D T_\pi\hat v(w)\|_D^2.
$$

在标准 on-policy 线性收敛条件下，TD-Linear 收敛到 projected Bellman equation 的解，此时 $J_{\mathrm{PBE}}=0$。[附录 · Projected Bellman Equation](appendix.md#linear-td-projected-bellman-equation)

</div>
</div>

<span id="_5-1-sarsa-·-用采样到的下一动作"></span>

## 5. Sarsa with Function Approximation {#approximate-control}

<div class="td-slide">
<div class="td-slide-title">Semi-gradient Sarsa · 从 State Value 换成 Action Value</div>
<div class="td-slide-body">

把第 3 节 **semi-gradient TD** 的 state value $\hat v(s,w)$ 换成 action value $\hat q(s,a,w)$。下一动作 $a_{t+1}$ 按当前策略 $\pi_t(\cdot\mid s_{t+1})$ 采样。

$$
\begin{aligned}
y_t&=r_{t+1}+\gamma\hat q(s_{t+1},a_{t+1},w_t),\\
\delta_t&=y_t-\hat q(s_t,a_t,w_t),\\
w_{t+1}&=w_t+\alpha_t\delta_t\nabla_w\hat q(s_t,a_t,w_t).
\end{aligned}
$$

更新时将 $y_t$ 当作常数，只对当前预测求导。终止转移取 $y_t=r_{t+1}$。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Pseudocode · Sarsa Control</div>
<div class="td-slide-body">

初始化 $w$。每个 episode 从 $s_0$ 出发，按当前 $\varepsilon$-greedy policy 选初始动作。

1. **Collect experience**。执行 $a_t$，观察 $r_{t+1}$ 和 $s_{t+1}$。若未终止，按 $\pi_t$ 采样下一动作 $a_{t+1}$。
2. **Policy evaluation**。用上面的 Sarsa 更新式算出 $w_{t+1}$。
3. **Policy improvement**。用更新后的 $\hat q$ 在 $s_t$ 选一个 greedy action $a^*$，再更新 $\varepsilon$-greedy 的概率。
4. 若未终止，进入 $s_{t+1}$ 并沿用已采样的 $a_{t+1}$。

令 $m=|\mathcal A(s_t)|$，第 3 步的策略更新为

$$
\pi_{t+1}(a\mid s_t)=
\begin{cases}
1-\varepsilon+\varepsilon/m, & a=a^*,\\
\varepsilon/m, & a\ne a^*.
\end{cases}
$$

评估用到的下一动作，也是交互中实际执行的下一动作，因此 Sarsa 是 **on-policy**。

</div>
</div>

<span id="_5-2-q-learning-·-用下一状态的最大动作值"></span>

## 6. Q-learning with Function Approximation {#q-learning-function-approximation}

<div class="td-slide">
<div class="td-slide-title">Semi-gradient Q-learning · Greedy Target</div>
<div class="td-slide-body">

沿用 Sarsa 的 **semi-gradient** 更新形式，在下一状态的可用动作中取最大价值。

$$
\begin{aligned}
y_t&=r_{t+1}+\gamma\max_b\hat q(s_{t+1},b,w_t),\\
\delta_t&=y_t-\hat q(s_t,a_t,w_t),\\
w_{t+1}&=w_t+\alpha_t\delta_t\nabla_w\hat q(s_t,a_t,w_t).
\end{aligned}
$$

终止转移取 $y_t=r_{t+1}$。求 gradient 时把 $y_t$ 当作常数。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Pseudocode · Q-learning Control</div>
<div class="td-slide-body">

初始化参数 $w_0$、策略 $\pi_0$ 和探索率 $\varepsilon>0$。每个 episode 从初始状态开始，重复以下步骤。

1. **Collect experience**。按 $\pi_t(\cdot\mid s_t)$ 选动作 $a_t$，执行后观察 $r_{t+1}$ 和 $s_{t+1}$。
2. **Value update**。用 greedy TD target 计算 $\delta_t$，再用上式更新参数。
3. **Policy update**。用更新后的 $\hat q$ 在 $s_t$ 选一个 greedy action。沿用第 5 节的 $\varepsilon$-greedy 规则，给该动作 $1-\varepsilon+\varepsilon/m$ 的概率，给其他动作 $\varepsilon/m$，其中 $m=|\mathcal A(s_t)|$。
4. 若未终止，进入 $s_{t+1}$，下一轮再按更新后的策略选动作。

课件将这一实现称为 **on-policy version**，因为训练过程中用当前探索策略在线采样。更新仍使用 greedy target，因此 Q-learning 仍是 **off-policy**。

</div>
</div>

## 7. Deep Q-learning（DQN） {#deep-q-learning}

#### 7.1 从 Q-learning 到 DQN Loss

<div class="td-slide">
<div class="td-slide-title">Deep Q-Network · 用神经网络近似动作价值</div>
<div class="td-slide-body">

DQN 用神经网络作为 **nonlinear function approximator** 来估计 $q^*$。沿用第 6 节的 greedy target，把单步 TD error 的平方作为训练信号。先考虑预测和 target 都用同一组参数 $w$ 的写法。

$$
\begin{aligned}
Y(w)&=R+\gamma\max_{b\in\mathcal A(S')}\hat q(S',b,w),\\
\delta(w)&=Y(w)-\hat q(S,A,w),\\
J(w)&=\mathbb E[\delta(w)^2].
\end{aligned}
$$

**与 Bellman Optimality Equation 的关系**。若 $\hat q=q^*$，则 $\mathbb E[\delta\mid S,A]=0$。随机奖励或转移仍可能让单次 TD error 非零。这里是先对单次误差平方再取期望，Bellman optimality residual 的平方则是先对误差取条件期望再平方。

因为 $w$ 同时出现在预测和 $Y(w)$ 中，每次更新预测也会改变 target。DQN 用另一组参数计算 target，并把这组参数固定一段时间。

</div>
</div>

#### 7.2 Online Network 与 Target Network {#_6-1-online-network-与-target-network}

<div class="td-slide">
<div class="td-slide-title">Technique 1 · 固定 Target，再更新 Online Network</div>
<div class="td-slide-body">

**Online network**（课件也称 main network）用参数 $w$ 预测 $\hat q(S,A,w)$。**Target network** 用参数 $w_T$ 计算 $Y_T$。

$$
\begin{aligned}
Y_T&=R+\gamma\max_{b\in\mathcal A(S')}\hat q(S',b,w_T),\\
L(w;w_T)&=\mathbb E[(Y_T-\hat q(S,A,w))^2].
\end{aligned}
$$

终止转移取 $Y_T=R$。固定 $w_T$，记 $e_T=Y_T-\hat q(S,A,w)$。平方损失的 gradient 为

$$
\nabla_w L=-2\mathbb E[e_T\nabla_w\hat q(S,A,w)].
$$

训练时用 mini-batch 的平均值估计这个 gradient，只更新 $w$。初始化取 $w_T=w$，之后每隔 $C$ 次训练更新执行一次 $w_T\leftarrow w$。

</div>
</div>

#### 7.3 Experience Replay {#_6-2-experience-replay}

<div class="td-slide">
<div class="td-slide-title">Replay Buffer · 随机抽取 Mini-batch</div>
<div class="td-slide-body">

把转移 $(s,a,r,s')$ 和终止标记存进 **replay buffer**。每次训练从 buffer 中随机抽一个 mini-batch。这会打散原轨迹的时间顺序，减弱相邻转移的相关性，也允许同一条经验用于多次更新。

<strong>均匀抽取的对象是什么？</strong> 目标函数中，$(S,A)\sim d$ 决定各状态动作对的权重，给定 $(S,A)$ 后，$(R,S')$ 的联合分布由环境决定。课件以均匀的 $d$ 说明等权目标。实际的 uniform replay 给 buffer 中每条记录相同的抽样权重，因此状态动作对的权重仍随它在 buffer 中出现的频率变化。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Tabular Q-learning · Replay 也能复用样本</div>
<div class="td-slide-body">

- **表格法**。为每个 $(s,a)$ 求解一条 Bellman optimality equation。采样频率影响更新次数，均匀访问和 replay 都不是必要条件，关键是相关表项得到充分访问。
- **DQN**。不同状态动作对共享参数，mini-batch loss 是一个加权平均，采样分布决定拟合更重视哪些数据。
- 表格法也可以用 replay。一次环境交互产生的转移可以反复用于更新，从而提高 **sample efficiency**。

</div>
</div>

#### 7.4 Algorithm and Gridworld Example {#_6-3-algorithm-and-gridworld-example}

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
