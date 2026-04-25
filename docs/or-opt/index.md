# 运筹优化

运筹优化（Operations Research & Optimization）是研究如何在有限资源下做出最优决策的学科。

---

## 算法目录

### 建模方法

| 主题 | 说明 | 链接 |
|------|------|------|
| 整数规划建模技巧 | 逻辑约束、二选一、指示约束、布尔运算的线性化等 | [查看](integer-modeling-techniques.md) |

### 精确算法

**[总览：方法关系与阅读顺序 →](exact-algorithms.md)**

| 算法 | 说明 | 链接 |
|------|------|------|
| 分支定界（Branch and Bound） | 求解整数规划的经典方法，通过分支和定界剪枝搜索解空间 | [查看](branch-and-bound.md) |
| 分支切割（Branch and Cut） | 在分支定界基础上加入割平面，加速收敛 | [查看](branch-and-cut.md) |
| 列生成（Column Generation） | 求解大规模线性规划，按需生成变量列 | [查看](column-generation.md) |
| 分支定价（Branch-and-Price） | 分支定界与列生成的结合，求解大规模整数规划 | [查看](branch-and-price.md) |
| 分支定价切割（Branch-Price-and-Cut, BPC） | 在分支定价各节点上加入有效不等式（割）以收紧 LP 界 | [查看](branch-price-and-cut.md) |
| Dantzig-Wolfe 分解（Dantzig–Wolfe Decomposition） | 将问题分解为主问题和子问题，利用块角结构 | [查看](dantzig-wolfe.md) |
| Benders 分解（Benders Decomposition） | 将混合整数规划分解为主问题和子问题，通过割平面迭代 | [查看](benders.md) |
| 拉格朗日（Lagrangian Relaxation） | 通过松弛复杂约束，将问题分解为易求解的子问题 | [查看](lagrangian.md) |

### 启发式算法

**[总览：分类与三类的边界 →](heuristic-algorithms.md)**

| 子类 | 说明 | 链接 |
|------|------|------|
| 基础启发式（Simple Heuristics） | 问题特化的构造/贪心/单阶段局部搜索等，常作初始解与热启动 | [查看](simple-heuristics.md) |
| 元启发式（Metaheuristics） | 通用高层迭代框架；已写 [模拟退火](simulated-annealing.md)、[禁忌搜索](tabu-search.md)，其余篇目见元启发式页 | [查看](metaheuristics.md) |
| 超启发式（Hyper-heuristics） | 在启发式算子/邻域层做选择或生成，强调与问题解耦、可迁移 | [查看](hyper-heuristics.md) |

### 图算法

| 算法 | 说明 | 链接 |
|------|------|------|
| Dijkstra | 非负权图上的单源最短路，贪心+优先队列 | [查看](dijkstra.md) |
| Bellman-Ford | 一般边权单源最短路、负边与负圈检测 | [查看](bellman-ford.md) |

---

