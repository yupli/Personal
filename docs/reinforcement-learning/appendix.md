---
pageClass: rl-summary
---

# 附录

## 第 2 课 · 策略评估的收敛证明 {#policy-evaluation-convergence}

[返回第二课 · 矩阵形式与策略评估](bellman-equation.md#_3-matrix-form-policy-evaluation)

<div class="td-slide">
<div class="td-slide-title">Proof · 为什么迭代会收敛？</div>
<div class="td-slide-body">

固定策略 $\pi$，设有限状态转移矩阵 $P_\pi$ 的每一行都是概率分布，折扣因子 $0\le\gamma<1$。真实价值 $\mathbf v_\pi$ 满足贝尔曼方程，迭代从任意 $\mathbf v_0$ 出发：

$$
\mathbf v_\pi=\mathbf r_\pi+\gamma P_\pi\mathbf v_\pi,\qquad
\mathbf v_{k+1}=\mathbf r_\pi+\gamma P_\pi\mathbf v_k.
$$

<strong>（1）写出误差的递推式。</strong> 令 $\boldsymbol\delta_k=\mathbf v_k-\mathbf v_\pi$。代入 $\mathbf v_{k+1}=\boldsymbol\delta_{k+1}+\mathbf v_\pi$ 和 $\mathbf v_k=\boldsymbol\delta_k+\mathbf v_\pi$：

$$
\begin{aligned}
\boldsymbol\delta_{k+1}+\mathbf v_\pi
&=\mathbf r_\pi+\gamma P_\pi(\boldsymbol\delta_k+\mathbf v_\pi),\\
\boldsymbol\delta_{k+1}
&=\gamma P_\pi\boldsymbol\delta_k+
  (\mathbf r_\pi+\gamma P_\pi\mathbf v_\pi-\mathbf v_\pi)\\
&=\gamma P_\pi\boldsymbol\delta_k.
\end{aligned}
$$

括号里的三项由贝尔曼方程正好抵消。反复代回推到初值：

$$
\boldsymbol\delta_k=\gamma P_\pi\boldsymbol\delta_{k-1}
=\cdots=\gamma^kP_\pi^k\boldsymbol\delta_0\qquad(k\ge 1).
$$

<strong>（2）说明为什么矩阵不会放大误差。</strong> 令 $\mathbf 1$ 为全 $1$ 列向量。因为 $P_\pi\mathbf 1=\mathbf 1$，所以 $P_\pi^k\mathbf 1=\mathbf 1$；矩阵的元素仍非负，故每个元素都在 $[0,1]$ 内。$P_\pi^k\boldsymbol\delta_0$ 的每个分量都是初始误差各分量的加权平均，绝对值不超过最大的初始绝对误差：

$$
\|\boldsymbol\delta_k\|_\infty
\le \gamma^k\|\boldsymbol\delta_0\|_\infty
\xrightarrow[k\to\infty]{}0.
$$

因此 $\mathbf v_k\to\mathbf v_\pi$。同样的性质也保证 $I-\gamma P_\pi$ 可逆：若 $(I-\gamma P_\pi)\mathbf x=0$，则 $\|\mathbf x\|_\infty\le\gamma\|\mathbf x\|_\infty$，在 $\gamma<1$ 时只可能有 $\mathbf x=0$。

<strong>用相邻两轮的差估计误差。</strong> 令 $\Delta=\|\mathbf v_{k+1}-\mathbf v_k\|_\infty$。展开迭代式可知，之后的第 $j$ 次变化不超过 $\gamma^j\Delta$（从 $j=1$ 开始）。把之后的各次变化加总，即得
$\|\mathbf v_{k+1}-\mathbf v_\pi\|_\infty\le\gamma\Delta/(1-\gamma)$。

</div>
</div>

## 第 6 课 · Robbins–Monro Convergence Conditions {#robbins-monro-convergence-conditions}

[返回第六课 · Robbins–Monro Theorem](stochastic-approximation.md#robbins-monro-theorem)

### （1）What the Three Conditions Control

<div class="td-slide">
<div class="td-slide-title">Slope, Step Sizes and Noise</div>
<div class="td-slide-body">

- **Slope bounds**。$g'(w)\ge c_1>0$ 让 $g$ 严格递增，并在 $w\to\pm\infty$ 时分别走向 $\pm\infty$，所以有唯一的 root。上界 $g'(w)\le c_2$ 控制给定距离下 $g(w)$ 的大小。
- **Step sizes**。平方可和保证 $a_k\to0$，而 $\sum_k a_k=\infty$ 让剩余的总步长一直足够大。
- **Noise**。给定历史后，noise 的均值为零，表示观测没有系统性漂移。常见例子是与初值独立、均值为零、方差有限的 i.i.d. noise，分布可以是非 Gaussian 的。

</div>
</div>

### （2）Why Square Summability Matters

<div class="td-slide">
<div class="td-slide-title">Square Summability · 压低后期 Noise</div>
<div class="td-slide-body">

在 root 附近，$g(w_k)$ 变小，noise 仍会扰动单步更新：

$$
w_{k+1}-w_k=-a_k g(w_k)-a_k\eta_k.
$$

如果 $w_k$ 最终收敛，相邻两步的差必然趋于零。在定理的 noise 条件下，每个加权 noise 的条件二阶矩至多为 $Ma_k^2$，所以平方可和把这些扰动的二阶矩总量控制在有限范围内。

</div>
</div>

### （3）Why the Sum of Step Sizes Diverges

<div class="td-slide">
<div class="td-slide-title">Infinite Total Step Size · 留足后续修正空间</div>
<div class="td-slide-body">

将前 $n$ 步累加，得到总位移：

$$
w_{n+1}-w_1=-\sum_{k=1}^{n}a_k\widetilde g(w_k,\eta_k).
$$

式子右侧的负号来自 update rule。若观测的绝对值至多为 $B$，而 $\sum_k a_k$ 有限，则总位移最多为 $B\sum_k a_k$。当初值离 root 比这个上界还远时，迭代走不到 root。这说明 step size 不能缩得太快。

</div>
</div>

### （4）A Step-Size Sequence That Works

<div class="td-slide">
<div class="td-slide-title">Example · aₖ = 1/k</div>
<div class="td-slide-body">

对于 $a_k=1/k$，**harmonic series** 的部分和随 $\ln n$ 增长：

$$
\lim_{n\to\infty}\left(\sum_{k=1}^{n}\frac1k-\ln n\right)
=\kappa\approx 0.577.
$$

这里 $\kappa$ 是 **Euler–Mascheroni constant**。因此 $\sum_k a_k=\infty$。平方和则是 **Basel problem** 给出的有限值：

$$
\sum_{k=1}^\infty a_k^2=\sum_{k=1}^\infty\frac1{k^2}=\frac{\pi^2}{6}.
$$

</div>
</div>

### （5）Dvoretzky’s Convergence Theorem {#dvoretzky-convergence-theorem}

<div class="td-theorem">
<div class="td-theorem-title">Theorem · Dvoretzky’s Convergence Theorem</div>
<div class="td-theorem-body">

考虑以下标量随机递推。$e_k$ 表示要收敛到零的量，对应图中的 $w_k$：

$$
e_{k+1}=(1-\alpha_k)e_k+\beta_k\xi_k.
$$

$\mathcal H_k$ 包含当前的 $e_k$ 和此前的观测、迭代与系数。允许 $\alpha_k,\beta_k\ge0$ 随历史变化，两者在收到本轮 noise $\xi_k$ 前已经确定。

1. **Coefficients**。几乎必然有 $\sum_k\alpha_k=\infty$。两组平方和 $\sum_k\alpha_k^2$、$\sum_k\beta_k^2$ 几乎必然有限，并有与样本路径无关的上界。可用与样本路径无关的发散下界验证第一项。
2. **Noise**。几乎必然有 $\mathbb E[\xi_k\mid\mathcal H_k]=0$ 和 $\mathbb E[\xi_k^2\mid\mathcal H_k]\le C<\infty$，其中 $C$ 与 $k$ 无关。

于是 $e_k\to0$ **almost surely**。[课程教材 Theorem 6.2](https://raw.githubusercontent.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning/refs/heads/main/Book-all-in-one.pdf)

</div>
</div>

#### Applying the Theorem to Robbins–Monro

<div class="td-slide">
<div class="td-slide-title">Proof Sketch · 把 Root Estimate 写成 Error Recursion</div>
<div class="td-slide-body">

令 $e_k=w_k-w^*$。由 **mean value theorem**，可写 $g(w_k)-g(w^*)=b_ke_k$，其中 $c_1\le b_k\le c_2$。当 $e_k\ne0$ 时，$b_k$ 取两点间的 **secant slope**，因此收到本轮观测前就已确定。$e_k=0$ 时可取 $b_k=c_1$。

代入 RM 的 update rule，得到

$$
e_{k+1}=(1-a_k b_k)e_k+a_k(-\eta_k).
$$

- 取 $\alpha_k=a_k b_k$、$\beta_k=a_k$ 和 $\xi_k=-\eta_k$。
- $\alpha_k\ge c_1a_k$ 保证总和发散，$\alpha_k\le c_2a_k$ 保证平方和有限。$\beta_k$ 的平方和也有限。
- 换号后的 noise 保持条件零均值和二阶矩上界。

于是 $e_k\to0$ almost surely，也就是 $w_k\to w^*$ almost surely。

</div>
</div>

#### Other Applications

- **Mean estimation**。令 $e_k=w_k-\mu$，其中 $\mu=\mathbb E[X]$。第一节的 update rule 对应 $\alpha_k=\beta_k=1/k$、$\xi_k=x_k-\mu$。若按课件取 $w_1=x_1$，则从 $k=2$ 起，对方差有限的 i.i.d. samples 应用定理，就能得到 almost sure convergence。
- **TD learning and Q-learning**。这一定理的扩展可用于分析同时更新多个 states 或 state–action pairs 的收敛。[课程教材 §6.3.2–6.3.4](https://raw.githubusercontent.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning/refs/heads/main/Book-all-in-one.pdf)
## 第 6 课 · SGD as Robbins–Monro {#sgd-as-robbins-monro}

<div class="td-slide">
<div class="td-slide-title">From GD to SGD · True Gradient and Sample Gradient</div>
<div class="td-slide-body">

在可以交换微分和期望的条件下，GD 使用 true gradient，SGD 使用单个 sample 给出的 gradient：

$$
\begin{aligned}
\text{GD:}\quad &w_{k+1}=w_k-\alpha_k\mathbb E_X[\nabla_w f(w_k,X)],\\
\text{SGD:}\quad &w_{k+1}=w_k-\alpha_k\nabla_w f(w_k,x_k).
\end{aligned}
$$

二者的差异来自本轮 sample 的 **gradient noise**。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">From Optimization to Root Finding</div>
<div class="td-slide-body">

对可微的无约束目标 $J(w)=\mathbb E_X[f(w,X)]$，minimizer 满足 **stationarity condition**。令

$$
g(w)=\nabla_w J(w)=\mathbb E_X[\nabla_w f(w,X)].
$$

求 stationary point 就写成 **root-finding problem** $g(w)=0$。当 $J$ 是 strongly convex 时，这个 root 是唯一的 minimizer。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Robbins–Monro Update · Identify the Noise</div>
<div class="td-slide-body">

在 $w_k$ 处，把 sample gradient 写成 noisy observation：

$$
\begin{aligned}
\eta_k &= \nabla_w f(w_k,x_k)-g(w_k),\\
\tilde g(w_k,\eta_k)&=g(w_k)+\eta_k=\nabla_w f(w_k,x_k).
\end{aligned}
$$

如果 $x_k$ 独立于抽样前的历史 $\mathcal H_k$ 且服从 $X$ 的分布，那么 $\mathbb E[\eta_k\mid\mathcal H_k]=0$。令 RM 的 step size $a_k=\alpha_k$，代入其 update rule：

$$
w_{k+1}=w_k-a_k\tilde g(w_k,\eta_k)
=w_k-\alpha_k\nabla_w f(w_k,x_k).
$$

这就是 SGD。这个等式也适用于 vector parameters。标量版本的 almost sure convergence 还需要[正文定理](stochastic-approximation.md#sgd-convergence)中的 curvature、step size 和 noise 条件。

</div>
</div>
