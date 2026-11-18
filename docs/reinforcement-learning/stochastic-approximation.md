---
pageClass: rl-summary
---

# 第 6 课 · 随机近似与随机梯度下降 · V2（总结）

[切换到 V1（逐页）](stochastic-approximation-slides.md)

## 1. Incremental Mean Estimation

设 $w_k$ 是前 $k-1$ 个样本的均值。收到 $x_k$ 后，把旧和写成 $(k-1)w_k$：

$$
\begin{aligned}
w_{k+1}
&=\frac{(k-1)w_k+x_k}{k}\\
&=w_k+\frac1k(x_k-w_k).
\end{aligned}
$$

第一步 $1/k=1$ 令 $w_2=x_1$。此后只需保留估计和计数。$1/k$ 保证每个样本等权。一般步长 $\alpha_k$ 给出不同权重，常数步长会对较新的数据赋予更大权重。

## 2. Robbins–Monro · Root Finding under Noise

要求 $g(w^*)=0$，每步只可观察 $\widetilde g(w_k,\eta_k)=g(w_k)+\eta_k$。更新式为

$$
w_{k+1}=w_k-a_k\widetilde g(w_k,\eta_k).
$$

若 $g$ 递增，根右边的正函数值把估计往左推，根左边则相反。带噪声时单次方向可能出错，因此需要同时约束步长和噪声。

### Convergence Conditions

| Condition | What it controls |
| --- | --- |
| $0<c_1\le g'(w)\le c_2$ | 正下界保证全局增长和唯一根，上界限制确定性更新的幅度 |
| $\sum_k a_k=\infty$ | 总修正能力不会提前耗尽 |
| $\sum_k a_k^2<\infty$ | 步长趋零，使加权噪声的累计方差可控 |
| $\mathbb E[\eta_k\mid\mathcal F_k]=0$，且条件二阶矩统一有界 | $\mathcal F_k$ 表示本轮观测之前的历史。噪声没有系统性漂移，方差受控 |

这些是标量 RM 的一组充分条件，结论是 $w_k\to w^*$ 几乎必然成立。课件把噪声条件简写为有限二阶矩。使用该结论时应明确矩的控制，例如上表的统一上界。典型步长 $a_k=1/k$。常数步长违反平方可和，$1/k^2$ 的总步长有限。

令误差为 $e_k=w_k-w^*$。中值定理给出 $g(w_k)=h_ke_k$，其中 $h_k\in[c_1,c_2]$。所以

$$
e_{k+1}=(1-a_k h_k)e_k-a_k\eta_k.
$$

这就是课件 Dvoretzky 形式中的「收缩项加零均值噪声」。条件零均值使平方误差展开后的交叉项在取条件期望时消失。$\sum a_k$ 与 $\sum a_k^2$ 分别控制长期收缩和噪声累积。

$$
\begin{aligned}
\mathbb E[e_{k+1}^2\mid\mathcal F_k]
&=(1-a_kh_k)^2e_k^2\\
&\quad+a_k^2\mathbb E[\eta_k^2\mid\mathcal F_k].
\end{aligned}
$$

当步长足够小时，第一项的系数小于 1，收缩量与 $a_k$ 同阶。若条件二阶矩的上界为 $C$，第二项的总和至多为 $C\sum_k a_k^2$。

### Mean Estimation as RM

令 $\mu=\mathbb E[X]$，取 $g(w)=w-\mu$、$\widetilde g(w,x)=w-x$，则

$$
\eta_k=\mu-x_k,\qquad
w_{k+1}=w_k+\alpha_k(x_k-w_k).
$$

斜率恒为 1。iid 且有限方差的样本满足这里的噪声条件，所以步长符合 RM 条件时，仍可估计 $\mu$。

## 3. Stochastic Gradient Descent

令 $J(w)=\mathbb E[f(w,X)]$。可交换微分与期望时，$g(w)=\nabla J(w)=\mathbb E[\nabla f(w,X)]$。寻找驻点就是求 $g(w)=0$。单样本梯度的分解为

$$
\begin{aligned}
\widetilde g_k &= \nabla f(w_k,X_k),\\
\eta_k &= \widetilde g_k-\nabla J(w_k),\\
w_{k+1} &= w_k-\alpha_k\widetilde g_k.
\end{aligned}
$$

新样本独立于观测前的历史时，$\mathbb E[\eta_k\mid\mathcal F_k]=0$。课件的标量收敛条件用正的曲率上下界、RM 步长及 iid 样本。严格套用 RM 还要检查梯度噪声的二阶矩。严格正曲率使驻点成为唯一极小值。

平方损失直接连接三种递推：

$$
f(w,X)=\tfrac12\|w-X\|^2,\quad
\nabla f(w,X)=w-X,\quad
\nabla J(w)=w-\mu.
$$

因此最优解 $w^*=\mu$，其 SGD 更新就是增量均值。三个层次可以读成 <strong>递推均值 → SGD → RM</strong>，每一项都是下一项的特例。

### Relative Gradient Error

在一维、曲率下界为 $c>0$ 时，

$$
\begin{aligned}
|\nabla J(w_k)| &\ge c|w_k-w^*|,\\
\frac{|\widetilde g_k-\nabla J(w_k)|}{|\nabla J(w_k)|}
&\le\frac{|\widetilde g_k-\nabla J(w_k)|}{c|w_k-w^*|}.
\end{aligned}
$$

靠近最优点时，真实梯度变小，随机梯度仍可能波动，所以相对误差可能变大。课件的迭代轨迹体现这一现象，该不等式本身只给出上界。

## 4. BGD, MBGD & SGD

有限数据目标 $J_n(w)=n^{-1}\sum_i f(w,x_i)$。从索引中均匀抽取 $I$ 时，$\mathbb E[f(w,x_I)]=J_n(w)$，因此单样本梯度是经验梯度的无偏估计。

| Method | Gradient used at step $k$ | per-step sample count |
| --- | --- | ---: |
| BGD | $\frac1n\sum_i\nabla f(w_k,x_i)$ | $n$ |
| MBGD | $\frac1m\sum_{j=1}^m\nabla f(w_k,x_{I_j})$ | $m$ |
| SGD | $\nabla f(w_k,x_I)$ | $1$ |

独立有放回采样时，MBGD 梯度协方差是单样本的 $1/m$。批量增大通常降低单步随机性但提高开销，比较收敛曲线时要区分迭代轮数和处理的样本数。对经验平方损失，$1/k$ 步长使 BGD 第一步到全体均值，MBGD 累计批均值，SGD 累计单样本均值。
