---
pageClass: rl-summary
---

# 第 7 课 · 时序差分方法 · V2（总结）

[切换到 V1（逐页）](temporal-difference-slides.md)

## 1. Temporal-Difference (TD) · State-value Prediction

#### （1）Algorithm Description

<div class="td-slide">
<div class="td-slide-title">TD learning of state values – Algorithm description</div>
<div class="td-slide-body">

**The data/experience required by the algorithm**

- $(s_0,r_1,s_1,\ldots,s_t,r_{t+1},s_{t+1},\ldots)$ or $\{(s_t,r_{t+1},s_{t+1})\}_t$, generated following the given policy $\pi$.

**The TD learning algorithm**

<div class="td-slide-equation">

$$
\begin{cases}
v_{t+1}(s_t)=v_t(s_t)-\alpha_t(s_t)\bigl[v_t(s_t)-[r_{t+1}+\gamma v_t(s_{t+1})]\bigr], & (1)\\
v_{t+1}(s)=v_t(s),\quad \forall s\ne s_t, & (2)
\end{cases}
$$

</div>

where $t=0,1,2,\ldots$. Here $v_t(s_t)$ is the current estimate of $v_\pi(s_t)$, and $\alpha_t(s_t)$ is the learning rate for $s_t$ at time $t$.

- At time $t$, only the value of the visited state $s_t$ is updated. For every other state, (2) applies.
- Equation (2) is omitted when the context is clear.

</div>
</div>

#### （2）TD Target and TD Error

<div class="td-slide">
<div class="td-slide-body">

The TD algorithm can be annotated as

<div class="td-slide-equation">

$$
\underbrace{v_{t+1}(s_t)}_{\text{new estimate}}
=\underbrace{v_t(s_t)}_{\text{current estimate}}
-\alpha_t(s_t)\left[
\overbrace{v_t(s_t)-\bigl[\underbrace{r_{t+1}+\gamma v_t(s_{t+1})}_{\text{TD target }\bar v_t}\bigr]}^{\text{TD error }\delta_t}
\right].\qquad (3)
$$

</div>

Here

$$
\bar v_t\mathrel{\dot{=}}r_{t+1}+\gamma v_t(s_{t+1})
$$

is called the <strong class="td-slide-emphasis">TD target</strong>.

$$
\delta_t\mathrel{\dot{=}}v_t(s_t)-[r_{t+1}+\gamma v_t(s_{t+1})]
=v_t(s_t)-\bar v_t
$$

is called the <strong class="td-slide-emphasis">TD error</strong>.

The new estimate $v_{t+1}(s_t)$ combines the current estimate $v_t(s_t)$ and the TD error, scaled by the learning rate.

</div>
</div>

#### （3）Why It Is Called the TD Target

<div class="td-slide">
<div class="td-slide-body">

**First, why is $\bar v_t$ called the TD target?**

<span class="td-slide-emphasis">The algorithm drives the current state-value estimate towards the target.</span>

To see that,

$$
\begin{aligned}
v_{t+1}(s_t)
&=v_t(s_t)-\alpha_t(s_t)[v_t(s_t)-\bar v_t]\\[3pt]
v_{t+1}(s_t)-\bar v_t
&=v_t(s_t)-\bar v_t-\alpha_t(s_t)[v_t(s_t)-\bar v_t]\\[3pt]
&=[1-\alpha_t(s_t)][v_t(s_t)-\bar v_t]\\[3pt]
\bigl|v_{t+1}(s_t)-\bar v_t\bigr|
&=\bigl|1-\alpha_t(s_t)\bigr|\bigl|v_t(s_t)-\bar v_t\bigr|.
\end{aligned}
$$

For a small positive learning rate $\alpha_t(s_t)$,

$$
0<1-\alpha_t(s_t)<1.
$$

Therefore,

$$
|v_{t+1}(s_t)-\bar v_t|\le |v_t(s_t)-\bar v_t|,
$$

so the updated estimate moves towards this step’s target $\bar v_t$.

</div>
</div>

#### （4）Interpretation of the TD Error

<div class="td-slide">
<div class="td-slide-body">

**Second, what is the interpretation of the TD error?**

$$
\delta_t=v_t(s_t)-[r_{t+1}+\gamma v_t(s_{t+1})].
$$

- It compares estimates across **two consecutive time steps**.
- It reflects a discrepancy between $v_t$ and $v_\pi$. To see this, define

$$
\delta_{\pi,t}\mathrel{\dot{=}}v_\pi(s_t)-[r_{t+1}+\gamma v_\pi(s_{t+1})].
$$

The Bellman expectation equation gives

$$
\begin{aligned}
\mathbb E_\pi[\delta_{\pi,t}\mid S_t=s_t]
&=v_\pi(s_t)-\mathbb E_\pi[R_{t+1}+\gamma v_\pi(S_{t+1})\mid S_t=s_t]\\
&=0.
\end{aligned}
$$

- If $v_t=v_\pi$, then the **conditional mean TD error** is zero.
- A nonzero conditional mean TD error therefore indicates that $v_t$ differs from $v_\pi$.

</div>
</div>

给定当前价值表和状态，上述结论用的是对下一步转移取平均后的误差。即使价值表准确，单次转移仍可能产生非零误差。

### Bellman Equation & Robbins–Monro

记 $[T_\pi v](s)=\mathbb E_\pi[R_{t+1}+\gamma v(S_{t+1})\mid S_t=s]$。要求的根是 $v-T_\pi v=0$。给定当前价值表及当前状态后，一次转移产生的 $\delta_t$ 是残差 $v_t(s_t)-[T_\pi v_t](s_t)$ 的随机观测。TD 将这个样本残差用于 Robbins–Monro 更新，在每次访问时修正相应状态的估计。

表格型、有限、折扣且固定策略时，在各状态充分访问和满足标准噪声条件下，常用局部步长条件为 $\sum_t\alpha_t(s)=\infty$、$\sum_t\alpha_t(s)^2<\infty$。未访问该状态时记 $\alpha_t(s)=0$。这给出几乎必然收敛。常数步长适合持续更新，但不能由该定理推出样本路径收敛。

### TD vs. Monte Carlo

#### （1）Online Updates and Task Types

<div class="td-slide">
<div class="td-slide-title">TD learning of state values – Algorithm properties</div>
<div class="td-slide-body">

TD learning and Monte Carlo (MC) learning are both **model-free**. What are the advantages and disadvantages of TD compared with MC?

| TD/Sarsa learning | MC learning |
| --- | --- |
| **Online.** TD can update a state or action value after receiving the next reward and observing the next state. Sarsa also samples the next action. | **Offline.** Standard episodic MC waits until the episode has been completely collected. |
| **Continuing tasks.** Online updates allow TD to handle both episodic and continuing tasks. | **Episodic tasks.** The full return used by standard episodic MC is available when the episode terminates. |

<div class="td-slide-caption">Comparison between TD learning and MC learning.</div>

</div>
</div>

#### （2）Bootstrapping and Estimation Variance

<div class="td-slide">
<div class="td-slide-title">TD learning of state values – Algorithm properties</div>
<div class="td-slide-body">

TD learning and Monte Carlo (MC) learning are both **model-free**. What are the advantages and disadvantages of TD compared with MC?

| TD/Sarsa learning | MC learning |
| --- | --- |
| **Bootstrapping.** The update uses an existing value estimate, so TD needs initial estimates. | **Non-bootstrapping.** MC estimates state or action values from sampled returns. Those targets are available independently of any initial value estimate. |
| **Typically lower estimation variance.** A one-step target involves fewer sampled quantities. For example, Sarsa uses the next reward $R_{t+1}$, state $S_{t+1}$ and action $A_{t+1}$. | **Typically higher estimation variance.** To estimate $q_\pi(s_t,a_t)$, MC uses samples of $R_{t+1}+\gamma R_{t+2}$ $+\gamma^2R_{t+3}+\cdots$. With $L$ steps and $\lvert\mathcal A\rvert$ possible actions per step, there are up to $\lvert\mathcal A\rvert^L$ action sequences. |

<div class="td-slide-caption">Comparison between TD learning and MC learning (continued).</div>

</div>
</div>

在固定策略下，完整 MC 回报的条件期望是真实价值。TD 的目标依赖当前估计，因此早期可能有偏。目标的偏差来自下一状态的估值误差。

## 2. Sarsa · Action-value Learning

观测五元组 $(S_t,A_t,R_{t+1},S_{t+1},A_{t+1})$。固定策略时，下一动作按同一策略抽取：

$$
\begin{aligned}
Y_t &= R_{t+1}+\gamma Q_t(S_{t+1},A_{t+1}),\\
Q_{t+1}(S_t,A_t)&=Q_t(S_t,A_t)
+\alpha_t\bigl[Y_t-Q_t(S_t,A_t)\bigr].
\end{aligned}
$$

其他表项本轮不变。期望目标来自 $q_\pi$ 的贝尔曼方程。固定策略评价的收敛要求逐状态动作对的覆盖与适当步长。用于 control 时，按同一 $\varepsilon$-greedy 策略采样和评价，并更新它，属于 on-policy 的广义策略迭代。固定正探索率评价的是含探索的策略。

### Sarsa · 原课件伪代码

<figure>
  <img src="./resources/temporal-difference/sarsa-29.webp" alt="第 29 页 Sarsa 伪代码" loading="lazy">
</figure>

## 3. Expected Sarsa & n-step Sarsa

<strong>Expected Sarsa</strong> 对下一动作求条件期望，环境仍用样本：

$$
Y_t=R_{t+1}+\gamma\sum_a
 \pi_t(a\mid S_{t+1})Q_t(S_{t+1},a).
$$

对给定的下一状态，这一步消除抽取单个动作带来的方差，代价是求和所需的动作值与概率。

<strong>n-step Sarsa</strong> 用前 $n$ 步真实奖励，再用价值估计补后缀：

$$
\begin{aligned}
G^{(n)}_t
&=\sum_{j=0}^{n-1}\gamma^jR_{t+j+1}\\
&\quad+\gamma^n Q(S_{t+n},A_{t+n}).
\end{aligned}
$$

从 $t$ 开始的更新必须等到第 $n$ 步信息就绪，或等回合提前结束。提前结束时只累计到末笔奖励，去掉自举项。$n=1$ 恢复 Sarsa，覆盖整个回合则得到 MC target。增加 $n$ 通常减少对当前估计的依赖，同时纳入更多采样随机性。

## 4. Q-learning · Learning Optimal Action Values

用下一状态的最大动作值替换 Sarsa 的下一动作样本：

$$
\begin{aligned}
Y_t &= R_{t+1}+\gamma\max_b Q_t(S_{t+1},b),\\
q^*(s,a)&=\mathbb E[R_{t+1}
+\gamma\max_b q^*(S_{t+1},b)\mid s,a].
\end{aligned}
$$

第一行是一次样本更新的目标，第二行是要解的 Bellman optimality equation。课件第 58 页汇总表的 Q-learning 一栏漏写了折扣因子，按第 43 页及更新式补上 $\gamma$。

| Policy | Role |
| --- | --- |
| Behavior policy | 生成经历，可保留探索概率 |
| Target policy | 决定更新的学习目标。Q-learning 用当前 Q 的贪心动作 |

Sarsa 使用行为策略抽出的 $A_{t+1}$ 评价同一策略。Q-learning 的最大值与实际执行的下一动作无关，属于 off-policy 更新。课件称第 50 页为 on-policy version，指边采样边更新用于生成经验的策略。该实现里的 Q 更新目标仍取最大值。第 51 页则直接使用独立行为策略已有的数据。无论使用哪种数据来源，仍需充分访问相关状态动作对。

课件的探索实验在比较数据覆盖。均匀探索生成的轨迹能覆盖更多状态动作对。若行为策略长期偏向少数动作，延长轨迹也可能只增加已常见的访问，稀少表项仍难学好。图中的纵轴比较训练中提取的贪心策略价值与已知最优价值的差距。

### Q-learning · 原课件两种实现

<figure>
  <img src="./resources/temporal-difference/q-learning-50.webp" alt="第 50 页 Q-learning 在线采样伪代码" loading="lazy">
</figure>

<figure>
  <img src="./resources/temporal-difference/q-learning-51.webp" alt="第 51 页 Q-learning 独立行为策略伪代码" loading="lazy">
</figure>

## 5. Unified TD Targets

所有动作值更新都可写成 $Q\leftarrow Q+\alpha(Y-Q)$，区别集中在目标 $Y$。

| Algorithm | Target $Y$ | Equation |
| --- | --- | --- |
| Sarsa | $R_{t+1}+\gamma Q(S_{t+1},A_{t+1})$ | 给定策略的 BE |
| Expected Sarsa | $R_{t+1}+\gamma\sum_a\pi(a\mid S_{t+1})Q(S_{t+1},a)$ | 给定策略的 BE |
| n-step Sarsa | $G^{(n)}_t$ | 给定策略的多步 BE |
| Q-learning | $R_{t+1}+\gamma\max_a Q(S_{t+1},a)$ | BOE |
| Monte Carlo | $G_t$ | 给定策略的完整回报期望 |

MC 的等权样本均值对应第 $N$ 次访问使用 $\alpha=1/N$。课件把 $\alpha=1$ 写作直接放入单次回报，这只是统一更新式中的单样本情形。

<style>
.rl-summary .vp-doc .td-slide {
  --vp-c-text-1: #191919;
  margin: 0.75rem 0 1.5rem;
  border: 1px solid #cecece;
  border-radius: 4px;
  overflow: hidden;
  background: #f2f2f2;
  color: #191919;
  font-size: 0.96rem;
  line-height: 1.55;
}

.td-slide-title {
  padding: 0.65rem clamp(0.85rem, 4vw, 1.5rem);
  background: #090875;
  color: #fff;
  font-size: 1.1em;
  line-height: 1.4;
}

.td-slide-body {
  padding: 0.9rem clamp(0.85rem, 4vw, 1.5rem);
}

.rl-summary .vp-doc .td-slide-body p,
.rl-summary .vp-doc .td-slide-body ul {
  margin-block: 0.55rem;
  line-height: inherit;
}

.td-slide-emphasis {
  color: #151590;
}

.td-slide-equation {
  color: #911f20;
}

.rl-summary .vp-doc .td-slide mjx-container[display="true"] {
  overflow-x: auto;
  padding: 0.45rem 0;
  background: transparent;
}

.rl-summary .vp-doc .td-slide table {
  display: table;
  width: 100%;
  table-layout: fixed;
  margin-block: 0.85rem 0.5rem;
  border-block: 3px double #4e4e4e;
}

.rl-summary .vp-doc .td-slide :is(tr, th, td) {
  background: transparent;
  border-color: #8b8b8b;
}

.rl-summary .vp-doc .td-slide :is(th, td) {
  padding: 0.5rem;
  border-inline-start: 0;
  overflow-wrap: anywhere;
  vertical-align: top;
  text-align: start;
  color: inherit;
}

.rl-summary .vp-doc .td-slide :is(th, td):last-child {
  border-inline-end: 0;
}

.td-slide-caption {
  text-align: center;
  font-size: 0.88em;
  color: #323267;
}
</style>
