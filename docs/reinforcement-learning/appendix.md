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
