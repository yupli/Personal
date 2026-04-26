# 运筹优化

运筹优化（Operations Research & Optimization）是研究如何在有限资源下做出最优决策的学科。

---

## 算法目录

### 建模方法

| 主题 | 说明 | 链接 |
|------|------|------|
| 整数规划建模技巧 | 逻辑约束、二选一、指示约束、布尔运算的线性化等 | [查看](modeling/integer-modeling-techniques.md) |

### 经典问题数学模型

| 问题 | 说明 | 链接 |
|------|------|------|
| 指派问题 | N 对 N 一一指派；二部图匹配、0–1 线性整数模型 | [查看](classic-models/assignment-problem.md) |
| 最短路问题 | $G=(V,E)$、$s$–$t$ 最短路；IP/LP 模型与整数最优解性质 | [查看](classic-models/shortest-path-problem.md) |
| 最大流问题 | 源汇网络、表 2.1 油运例；图 2.4/2.5；LP 与一般形 | [查看](classic-models/max-flow-problem.md) |
| 最优整数解特性与幺模矩阵 | 凸包与整数性；幺模/全幺模定义与定理 2.4.1–2.4.3 | [查看](classic-models/integer-solutions-unimodular-matrices.md) |
| 多商品网络流问题 | $G=(V,A)$、$K$ 与 $d_k$、$u_{ij}$、$c_{ij}^k$；LP (1)–(4)；图 2.13 示例网络 | [查看](classic-models/multicommodity-network-flow.md) |
| 多商品流运输问题 | MCNF 在直接配送、二部 $S$–$C$ 上的退化；LP (1)–(5)；去容量、单商品则退化为运输问题 TP (6)–(9) | [查看](classic-models/multicommodity-transportation.md) |
| 设施选址问题 | 选址-分配；图 2.17 多/少设施权衡；UFLP，目标 (1) 与约束 (2)–(4)，教材 2.60–2.63 同型 | [查看](classic-models/facility-location.md) |
| 旅行商问题 | 有向指派 (1)–(5)、MTZ、拆点；STSP 边模型、1-tree 与无向式 (8)–(12)；与教材 2.64–2.96 对读 | [查看](classic-models/traveling-salesman-problem.md) |
| 车辆路径规划问题 | （待写） | [查看](classic-models/vehicle-routing-problem.md) |

### 精确算法

[总览：方法关系与阅读顺序 →](exact/exact-algorithms.md)

| 算法 | 说明 | 链接 |
|------|------|------|
| 分支定界（Branch and Bound） | 求解整数规划的经典方法，通过分支和定界剪枝搜索解空间 | [查看](exact/branch-and-bound.md) |
| 分支切割（Branch and Cut） | 在分支定界基础上加入割平面，加速收敛 | [查看](exact/branch-and-cut.md) |
| 列生成（Column Generation） | 求解大规模线性规划，按需生成变量列 | [查看](exact/column-generation.md) |
| 分支定价（Branch-and-Price） | 分支定界与列生成的结合，求解大规模整数规划 | [查看](exact/branch-and-price.md) |
| 分支定价切割（Branch-Price-and-Cut, BPC） | 在分支定价各节点上加入有效不等式（割）以收紧 LP 界 | [查看](exact/branch-price-and-cut.md) |
| Dantzig-Wolfe 分解（Dantzig–Wolfe Decomposition） | 将问题分解为主问题和子问题，利用块角结构 | [查看](exact/dantzig-wolfe.md) |
| Benders 分解（Benders Decomposition） | 将混合整数规划分解为主问题和子问题，通过割平面迭代 | [查看](exact/benders.md) |
| 拉格朗日（Lagrangian Relaxation） | 通过松弛复杂约束，将问题分解为易求解的子问题 | [查看](exact/lagrangian.md) |

### 启发式算法

[总览：分类与三类的边界 →](heuristics/heuristic-algorithms.md)

| 子类 | 说明 | 链接 |
|------|------|------|
| 基础启发式（Simple Heuristics） | 问题特化的构造/贪心/单阶段局部搜索等，常作初始解与热启动；子篇见下表 | [总览](heuristics/simple/simple-heuristics.md) |
| 元启发式（Metaheuristics） | 通用高层迭代框架；已写 [模拟退火](heuristics/meta/simulated-annealing.md)、[禁忌搜索](heuristics/meta/tabu-search.md)、[遗传算法](heuristics/meta/genetic-algorithm.md)、[变邻域搜索](heuristics/meta/vns.md)、[ILS/迭代局搜](heuristics/meta/iterated-local-search.md)、[贪婪随机自适应搜索过程（GRASP）](heuristics/meta/grasp.md)、[粒子群](heuristics/meta/particle-swarm-optimization.md)、[蚁群](heuristics/meta/ant-colony-optimization.md)、[ALNS/自适应大邻域](heuristics/meta/alns.md)，其余见元启发式页 | [查看](heuristics/metaheuristics.md) |
| 超启发式（Hyper-heuristics） | 在启发式算子/邻域层做选择或生成，强调与问题解耦、可迁移 | [查看](heuristics/hyper-heuristics.md) |

| 子篇（基础启发式） | 说明 | 链接 |
|-------------------|------|------|
| 贪心（构造式） | 逐步取当前最好一步的构造，不回溯 | [查看](heuristics/simple/greedy-algorithm.md) |
| 插入启发式 | 将客户逐点插入弧上，兼容 TSP/带约束 VRP | [查看](heuristics/simple/insertion-heuristics.md) |
| Clarke–Wright 节约 | CVRP 边合并、按 savings 从大到小并线 | [查看](heuristics/simple/clarke-wright-savings.md) |
| 爬山 | 邻域内只接受改进、至局部最优 | [查看](heuristics/simple/hill-climbing.md) |
| 2-opt / 3-opt / k-opt | 路径边交换邻域，常用局搜子过程 | [查看](heuristics/simple/k-opt.md) |

### 图算法

| 算法 | 说明 | 链接 |
|------|------|------|
| Dijkstra | 非负权图上的单源最短路，贪心+优先队列 | [查看](graph/dijkstra.md) |
| Bellman-Ford | 一般边权单源最短路、负边与负圈检测 | [查看](graph/bellman-ford.md) |

**注**：为与侧栏一致，`docs/or-opt/` 下已按 `modeling`（建模）、`classic-models`（经典问题数学模型）、`exact`（精确算法）、`heuristics`（启发式，内含 `simple` / `meta`）、`graph`（图算法）分文件夹存放，便于在仓库中浏览。

## 主要参考文献

本站「运筹优化」栏目（`docs/or-opt/`）中许多条目的**概念界定、记号称谓与式号/图号**在整理时参考了《**运筹优化常用模型、算法及案例实战**》一书；**正文中的叙述与公式由本站自撰、可搜索与可访问**，与书中式号、图号在适当时可互查。若你自行引用本站笔记，请同时尊重原书版权与引注规范，并以正式出版物为准作学术引用。

---
