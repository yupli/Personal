# 基础启发式（Simple Heuristics）

基础启发式指面向问题结构直接设计的规则、贪心、邻域上短链改进等，通常不依赖跨问题的通用元层迭代框架。文献中常再分为构造式与改进式（定义与 [启发式算法总览](heuristic-algorithms.md) 中第一类下两子折叠一致）：

- **构造式**（constructive）：从空或部分解逐步追加至完整可行解，或等价的逐步生成。本库已写：[贪心](greedy-algorithm.md)、[插入启发式](insertion-heuristics.md)、[Clarke–Wright 节约](clarke-wright-savings.md)。  
- **改进式**（improvement）：从已有可行解出发，在邻域内作有限步改进或局部搜子过程。本库已写：[爬山](hill-climbing.md)、[2-opt / 3-opt / k-opt](k-opt.md)。  

二者常组合为「先构造、再改进」。与元启发式、精确法的配合见 [启发式算法总览](heuristic-algorithms.md) 中「一、基础启发式」及下两项折叠；元启发式总览见 [元启发式](metaheuristics.md)。

**注**：表意与上界/热启动的用法、典型反例，可在各子页与 [精确算法总览](exact-algorithms.md) 对照中逐步补全。
