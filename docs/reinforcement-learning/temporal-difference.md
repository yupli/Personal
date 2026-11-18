---
pageClass: rl-summary
---

# 第 7 课 · 时序差分方法 · V2（总结）

[切换到 V1（逐页）](temporal-difference-slides.md)

## 1. TD(0) · State-value Prediction

固定只依赖当前状态的策略 $\pi$。回报分解与马尔可夫性质给出

$$
\begin{aligned}
v_\pi(s)
&=\mathbb E_\pi[R_{t+1}+\gamma G_{t+1}\mid S_t=s]\\
&=\mathbb E_\pi[R_{t+1}+\gamma v_\pi(S_{t+1})\mid S_t=s].
\end{aligned}
$$

给定真实 $v_\pi$，一次转移给出右端的样本。实际用当前 $V_t$ 代替未知 $v_\pi$，形成 <strong>bootstrapped target</strong>。只更新访问到的状态：

$$
\begin{aligned}
Y_t &= R_{t+1}+\gamma V_t(S_{t+1}),\\
\delta_t &= Y_t-V_t(S_t),\\
V_{t+1}(S_t)&=V_t(S_t)+\alpha_t(S_t)\delta_t.
\end{aligned}
$$

课件把 TD error 定义为旧估计减目标，所以用减法更新。这里取相反号，结果相同。固定本轮 $Y_t$ 时，新估计与它的差乘上 $1-\alpha_t$。到达真正终止状态时令后续项为零。

从 Robbins–Monro 的角度，根方程是 $V-T_\pi V=0$。把当前价值表视为给定时，样本残差 $V_t(s)-Y_t$ 的条件期望是 $V_t(s)-[T_\pi V_t](s)$。一次转移给出了当前方程残差的随机观测。自举目标的条件期望在固定点处等于真实状态价值。

表格型、有限、折扣且固定策略时，在各状态充分访问和满足标准噪声条件下，常用局部步长条件为 $\sum_t\alpha_t(s)=\infty$、$\sum_t\alpha_t(s)^2<\infty$。未访问该状态时记 $\alpha_t(s)=0$。这给出几乎必然收敛。常数步长适合持续更新，但不能由该定理推出样本路径收敛。

### TD vs. Monte Carlo

| Aspect | TD | Monte Carlo |
| --- | --- | --- |
| Update timing | 收到转移即可更新 | 等到能计算完整回报 |
| Target | 真奖励加当前估值 | 实际轨迹回报 |
| Bootstrapping | 有。目标依赖当前价值 | 无。目标与初始化无关 |
| Typical variance | 较少未来随机量，常较低 | 多步随机性都进入回报 |
| Continuing tasks | 可逐步更新 | 固定长度截断时须考虑尾项 |

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
