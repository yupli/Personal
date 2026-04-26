# 启发式算法

与[精确算法](../exact/exact-algorithms.md)相对：启发式在可接受计算代价下求好的可行解或可行界，不保证在有限步内对任意实例证明全局最优（除非在特定结构下可证——那时往往已可纳入精确或近似理论框架讨论）。

在文献与工程实践中，常把基于启发式思想的方法按抽象层次区分为以下三类。本库后续会按子页 [基础启发式](simple/simple-heuristics.md)、[元启发式](metaheuristics.md)、[超启发式](hyper-heuristics.md) 分别展开，此处只作分类与边界的梳理，便于对号入座与放置笔记。

---

## 分类总览

| 类型 | 英文常称 | 核心特征（概括） |
|------|-----------|------------------|
| [基础启发式](simple/simple-heuristics.md) | simple / constructive / improvement heuristics 等 | 常再分构造式（自空/部分解逐步得完整可行解）与改进式（自可行解在邻域内改进），见下文第一类下两子折叠；通常不以通用元层框架自称 |
| [元启发式](metaheuristics.md) | metaheuristics | 在解空间上重复迭代的通用高层框架（如群体、热力学类比、记忆结构等），与问题建模通过编码与目标函数接口化 |
| [超启发式](hyper-heuristics.md) | hyper-heuristics | 在启发式算子/邻域/低层策略层面做选择、组合或生成，强调与问题解表示解耦、跨问题可迁移的管理层 |

三类的边界并非绝对：元启发式里也可嵌套问题特化算子；超启发式所选对象本身常是基础启发式或小粒度元策略。写作时以「主要贡献在那一层」为准即可。

以下分节与上表对应，默认折叠。第一类下另有两项折叠，对应「构造式」与「改进式」。

---

<details>
<summary>一、基础启发式 (Simple Heuristics)</summary>

在文献中常将简单启发式再分为「构造式」与「改进式」两类，边界有时交叉（如嵌套、先构造后改进），下两项折叠分别概说。

- **与元启发式相对**：不强调跨多问题同一套迭代外壳，而强调在「这个问题上、这条具体规则或邻域往往好用」。

<details>
<summary>（1）构造式（Constructive / construction heuristics）</summary>

- **对象**：在空解或部分可行构型上，按规则逐步追加决策（加边、点、工序、物品等）直至完整可行解；或一步生成（少数问题有闭式或随机一次性构造）。  
- **代表**：TSP/路由里最近邻、节约法（savings）思想；装箱里首次适应（FF）、最宽活跃（BWF）等；调度里 EDD、LPT 作优先序的列表调度等。本库子篇：[贪心](simple/greedy-algorithm.md)、[插入](simple/insertion-heuristics.md)、[Clarke–Wright](simple/clarke-wright-savings.md)。  
- **作用**：出第一解、可行上界、为精确法或 [GRASP](meta/grasp.md) 等提供起点；在列生成/分支定价中给初始列常属构造。  
- **与改进式衔接**：多实践上先构造再改进；单独一轮构造也可视为无随机化的起点生成。

</details>

<details>
<summary>（2）改进式（Improvement / local search 类低层算子）</summary>

- **对象**：已有一个完全可行解 $s$，在邻域 $N(s)$ 或若干邻域中单轮或有限步换边、换序、2-opt/插入等，使 $f$ 不增（最小化时）或接受有限次劣化。  
- **代表**：对换/插入一步、直至局部最优的 hill climbing 短跑、VNS/局搜里的子过程、调度里邻域内 swap。本库子篇：[爬山](simple/hill-climbing.md)、[2-opt / 3-opt / k-opt](simple/k-opt.md)。  
- **与元启发式关系**：其本身是算子或短链；不自称第几代主循环时，即基础启发式。一旦外包进固定降温、扰动+局搜等通用外层，就归入 [元启发式总览](metaheuristics.md) 的框架侧。  
- **与精确法协作**：在分支定界子结点热启动、或作轻量改修可行解，很常见。

</details>

</details>

<details>
<summary>二、元启发式 (Metaheuristics)</summary>

- **对象**：在编码后的解表示上，用通用迭代机制在探索（exploration）与利用（exploitation）间平衡。  
- **代表谱系**（本库会逐步展开，此处仅举例）：[模拟退火](meta/simulated-annealing.md)、[禁忌搜索](meta/tabu-search.md)、[遗传算法](meta/genetic-algorithm.md)、[变邻域搜索](meta/vns.md)、[迭代局部搜索](meta/iterated-local-search.md)、[贪婪随机自适应搜索过程（GRASP）](meta/grasp.md)、[粒子群](meta/particle-swarm-optimization.md)、[蚁群](meta/ant-colony-optimization.md)、[自适应大邻域](meta/alns.md) 与更广进化类、差分进化等。  
- **特点**：问题无关性强（同框架换编码与适应度即适用多类问题）；参数与算子对效果影响大，常与调参/自适应、混合精确子程序一起出现。

</details>

<details>
<summary>三、超启发式 (Hyper-heuristics)</summary>

- **对象**：不（主要）在全解空间上直接操作，而在低层启发式/邻域/扰动/交叉算子的池上学习或搜索：何时用哪种算子、以何顺序组合、或生成新低层规则。  
- **常见分法**（文献中多交叉使用）：选择型（基于规则、强化学习、贝叶斯等，从现成算子中选序列）、生成型（以语法或学习模型生成新的启发式或邻域）等。  
- **特点**：利于可迁移、可复现的「调算法」研究；在大型组合优化、调度、装箱等场景常见。

</details>

---

## 下一步

- 在 [基础启发式](simple/simple-heuristics.md)、[元启发式](metaheuristics.md)、[超启发式](hyper-heuristics.md) 中逐类补充算法、伪代码、适用场景与与精确法的协作方式。  
- 与 [精确算法总览](../exact/exact-algorithms.md) 对照：同一问题可写「精确分支定界 + 启发式上界/初始解」的完整工作流说明。
