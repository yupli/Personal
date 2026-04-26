# 元启发式（Metaheuristics）

元启发式是在编码解表示上，用通用高层迭代机制在探索与利用间平衡的启发式类方法。分类与三类边界见 [启发式算法总览](heuristic-algorithms.md)。

## 篇目

| 算法 | 说明 |
|------|------|
| [模拟退火（SA）](simulated-annealing.md) | 单点邻域搜索、Metropolis 接受准则与降温表，易于实现 |
| [禁忌搜索（TS）](tabu-search.md) | 邻域搜索 + 禁忌表与渴望准则，抑制短循环、离开局部优 |
| [遗传算法（GA）](genetic-algorithm.md) | 种群、选择/交叉/变异，编码与适应度依赖问题 |
| [变邻域搜索（VNS）](vns.md) | 多邻域结构 + 抖动与局部搜索，系统性跳出局部最优 |
| [粒子群优化（PSO）](particle-swarm-optimization.md) | 惯性/认知/社会三项、pbest 与 gbest、分量/向量两式、参数与主循环 |
| [蚁群优化（ACO）](ant-colony-optimization.md) | 图上的信息素与随机成比例构造，正反馈 + 挥发，适于路径类组合问题 |
| [自适应大邻域（ALNS）](alns.md) | 多类破坏/修复算子、轮盘权重与段更新得分，大邻域上的自适应搜索 |

其他元启发式篇目将随写作逐步补全。
