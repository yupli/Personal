---
pageClass: rl-summary
---

# 第 6 课 · Stochastic Approximation and Stochastic Gradient Descent · V2（总结）

<span id="_1-incremental-mean-estimation"></span>

## 1. Motivating Example

#### （1）Mean Estimation

<div class="td-slide">
<div class="td-slide-title">Motivating Example · Mean Estimation</div>
<div class="td-slide-body">

第五课用 **sample mean** 估计期望。给定 $N$ 个 samples，要计算的是

$$
\mathbb E[X]\approx \bar x
:=\frac{1}{N}\sum_{i=1}^{N}x_i.
$$

**怎样计算 $\bar x$？**

- **Batch method**。等全部 samples 到齐，再统一求平均。
  - 若 samples 陆续到来，这种做法要等到最后才能给出结果。
- **Incremental method**。每收到一个 sample，就更新当前估计。每一步都沿用上一次的结果，因此也是一种 **iterative method**。

</div>
</div>

#### （2）Derive the Incremental Update

<div class="td-slide">
<div class="td-slide-title">Incremental Update · 用旧均值和新 Sample 推出新均值</div>
<div class="td-slide-body">

按课件的下标，$w_{k+1}$ 是读入 $x_k$ 后的 estimate，包含前 $k$ 个 samples：

$$
w_{k+1}=\frac1k\sum_{i=1}^{k}x_i,
\qquad k=1,2,\ldots
$$

相应地，$w_k$ 是读入 $x_k$ **之前**的 estimate：

$$
w_k=\frac1{k-1}\sum_{i=1}^{k-1}x_i,
\qquad k\ge 2.
$$

把旧 samples 的总和写成 $(k-1)w_k$，再加上新 sample $x_k$：

$$
\begin{aligned}
w_{k+1}
&=\frac1k\left(\sum_{i=1}^{k-1}x_i+x_k\right)\\
&=\frac1k\bigl((k-1)w_k+x_k\bigr).
\end{aligned}
$$

整理出 **update rule**：

$$
\boxed{w_{k+1}=w_k-\frac1k(w_k-x_k)}.
$$

</div>
</div>

#### （3）Work Through the First Updates

<div class="td-slide">
<div class="td-slide-title">Incremental Mean · 逐步代入</div>
<div class="td-slide-body">

课件从 $w_1=x_1$ 开始。将新 sample 依次代入 update rule：

$$
\begin{aligned}
w_2 &= w_1-(w_1-x_1)=x_1,\\[3pt]
w_3 &= w_2-\frac12(w_2-x_2)\\
    &= \frac12(x_1+x_2),\\[3pt]
w_4 &= w_3-\frac13(w_3-x_3)\\
    &= \frac13(x_1+x_2+x_3).
\end{aligned}
$$

每一步得到的都是**截至当前的 sample mean**。读到第 $k$ 个 sample 后，结果为

$$
w_{k+1}=\frac1k\sum_{i=1}^{k}x_i.
$$

</div>
</div>

#### （4）Remarks

<div class="td-slide">
<div class="td-slide-title">Remarks · Estimate 可以随到随用</div>
<div class="td-slide-body">

- **Immediate estimate**。新 sample 一到，就能产出新的 mean estimate，可立刻用于后续计算。更新只需要旧 estimate、新 sample 和计数。
- **Early estimates are noisy**。前几步 samples 较少，$w_k$ 可能离 $\mathbb E[X]$ 很远，但已经有了可用的阶段性估计。

</div>
</div>
