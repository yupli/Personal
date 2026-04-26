# 贪婪随机自适应搜索过程（GRASP）

贪婪随机自适应搜索过程（Greedy Randomized Adaptive Search Procedure，GRASP）是多次重复「半贪心的随机化构造 → 局部搜索」的元启发式：构造阶段在每一步不是只选当前最好分量，而在「代价足够好的一批候选」中随机，从而解多样化；再对得到的全可行解做局搜抛光。与纯贪心加单轮局搜相比，随机化减轻一步错步步错的刚性；与 [迭代局搜](iterated-local-search.md) 相比不依赖长程扰动，而更多依赖每次重新抽样构造。见 [元启发式总览](metaheuristics.md)。

**名称**：部分资料或口语会误写为 GARSP 等，文献与代码中标准英文缩写是 GRASP。

---

## 构造阶段与候选列表（RCL）

从空（或根状态）起逐步往部分解上加入一个决策分量（TSP 中为下一城市、装箱中为下一放法等），直到得到完整可行解。设第 $t$ 步有候选集合 $C_t$，在最小化下可对各候选算逐元增量代价 $c(a)$ 或总成本下界等贪心标量，并排序（并列时按你的约定排）。

**RCL**：restricted candidate list，受限候选表。不唯取 $c$ 最小者，而取 $c$ 不高于某阈值的整批 $a$。常见阈值为

$$\mathrm{RCL} = \left\{\,a \in C_t \;\Big|\; c(a) \le c^{\min} + \alpha\,\bigl(c^{\max} - c^{\min}\bigr)\right\},$$

其中 $c^{\min} = \min_{a \in C_t} c(a)$、$c^{\max} = \max_{a \in C_t} c(a)$、$\alpha \in [0,1]$ 为随机化强度（有的文献在代价型与秩型 RCL 间变体，与论文/代码一致即可）：

- $\alpha = 0$：退化为纯贪心（RCL 常只有当前最优项，若唯一）。  
- $\alpha = 1$：满足上式阈值的候选可全部进 RCL，随机性大、多样性好。  
- 中间值：在「好」与「不太差」之间折中，是 GRASP 常用旋钮。  

在 RCL 上按均匀（或加权）律随机选一步。重复至整解 $s$。

**注**：也可用语义等价的前 $k$ 好候选（数量型 RCL），与上式可对照实现。

---

## 局部搜索

对构造得到的 $s$ 做问题相关的 $\mathrm{LocalSearch}(s)$，与 [ILS](iterated-local-search.md) 中局搜子程序同型：在邻域内改进到局部最优或达到步/时上限。GRASP 经典叙述通常不在外循环里对解向量另加温控或长禁忌记忆；历史最优用 $f^\star$ 与 $s^\star$ 单独维护即可。

---

## 主循环与终止

**外循环**：反复「$s \leftarrow \mathrm{Construct}(\alpha)$；$s' \leftarrow \mathrm{LocalSearch}(s)$；更新 $f^\star$、$s^\star$」，直至时间、总轮数、无改进等。同一实例上常独立多轮运行以利用随机性，报告最优一次或平均表现，依实验约定。

**与 ILS 等比较**：探索主要来自构造阶段的 RCL 抽样，而非热力学、禁忌或长程 kick；局搜可换为 [禁忌搜索](tabu-search.md) 等更强子程序，属混合实现。

---

## 主循环（最小化、示意框）

下框中 $\mathrm{Construct}( \cdot ; \alpha )$ 表示在参数 $\alpha$ 与上节 RCL 规则下做半贪心生完整可行解。$\mathrm{LocalSearch}$ 为局搜。$f$ 最小化，$f^\star$ 为历史最优值。

::: algorithm GRASP 主循环（半随机构造 + 局搜，最小化）

### 1. 初始化
$s^\star \leftarrow$ 无或某个可行初解，$f^\star$ 相应设定或 $+\infty$。选定 $\alpha$ 与 RCL 规则（比式/前 $k$ 名，与上文自洽）。定主过程终止（时间、总构造次数、无改进等）。

### 2. 未满足主终止时重复
- $s \leftarrow \mathrm{Construct}(\alpha)$（在随机种子与 RCL 下得到新初始可行解；若多起点或部分构造，在实现中写清接口）。  
- $s' \leftarrow \mathrm{LocalSearch}(s)$。  
- 若 $f(s') < f^\star$，则 $f^\star \leftarrow f(s')$，$s^\star \leftarrow s'$。  

### 3. 输出
输出 $s^\star$（与可选的迭代日志）。

:::

---

## 再说明：为何叫「自适应（adaptive）」

文献里 adaptive 多指在搜索中按经验调 $\alpha$、RCL 或子程序（自适化 GRASP）。本页以定参 RCL 加构造与局搜为骨架；若实现里令 $\alpha$ 随无改进而变、或轮换多种构造/局搜，在可复现说明中单独写清。
