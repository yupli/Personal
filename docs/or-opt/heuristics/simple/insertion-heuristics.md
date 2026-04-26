# 插入启发式（Insertion Heuristics）

插入启发式是面向 TSP、VRP 等路径问题的经典构造式算法族：不采用「从某点像链条一样只向前延伸」的最近邻式生长，而往往先取一个很小的闭子回路（子环）作为核，再反复把尚未进环的客户「塞进」环上某条弧，直到所有点都进入路径（VRP 时还可同步派车/容量/时间窗检查）。是 [基础启发式](simple-heuristics.md) 中构造式代表之一；与 [Clarke–Wright 节约](clarke-wright-savings.md)、[贪心（构造式）](greedy-algorithm.md) 并列。总览见 [启发式算法总览](../heuristic-algorithms.md)。

**含义**：在最小化总路程时，在弧 (i, j) 上插入 k 的单步附加代价，常写为在一条边上「断开再接」的增值。

---

## 一、核心步骤（三阶段）

整体可概括为：先有环、再定下一个插谁、再定插到哪条弧的哪个位置。下面以单条 TSP 环、最小化总距叙述；CVRP 在「多车/车场/容量」上多一层路由分配，但插入增量与可行性检查仍同型。

### 1.1 选择初始子回路

先构造一个小的可行闭路（子环或带车场的短环），作为后续插入的载体。常见做法包括：

- 取距离最远的两点 i、j 形成往返式小回路（i → j → i，若对称则视作二点环的骨架）。  
- 取不共线三点作三角形 A–B–C–A，作为初始三角子环。  
- 有固定车场 0 时，可从 0 出发的短环或经文献约定的种子客户组合出发。

**注**：子环的具体取法在实现中必须固定，否则可复现性受影响。

### 1.2 选择步：下一个插谁

在尚未出现在当前环上的点中，用某种规则选下一个待插入点 k（与「最近/最远/最省/随机」等选择策略配合，见第三节四种变体）。

### 1.3 插入步：插到哪条弧、增值多少

对当前环上每一条有向或无序边 (i, j)（在实现里常按邻接顺序扫弧），将 k 插在 i 与 j 之间，即将原弧 (i, j) 换为 (i, k) 与 (k, j)。在仅计路程、且度量由距离 d(·,·) 给定时，该步路程增量为

$$
\Delta c(i,j,k) = d(i,k) + d(k,j) - d(i,j).
$$

（与文献中 $\Delta c = d_{ik} + d_{kj} - d_{ij}$ 同义。）再在所有可行弧位置上取使 $\Delta c$ 最小者（或结合选择策略的别的准则）。若有容量、时间窗等，还应在 $\Delta c$ 上叠加不可行罚项或直接筛掉不可行弧。

**止**：当所有客户都进环（及 VRP 中车线合法）时停；或不存在可行插入时按实现报错或启用车线扩展。

---

## 二、插入前后示意（在弧上“塞进”k）

<figure>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 230" width="100%" max-width="900" aria-label="在边 i j 上插入 k 的抽象，以及三角子环 A B C 上在 AB 间插入 k">
  <text x="8" y="20" font-size="13" fill="#333">左：在弧 (i, j) 上插入 k</text>
  <text x="458" y="20" font-size="13" fill="#333">右：三角子环 A–B–C 上在 A 与 B 间插入 k</text>
  <defs>
    <marker id="mIns" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#1976d2" />
    </marker>
  </defs>
  <text x="8" y="40" font-size="11" fill="#555">上：原弧 (i)–(j)。下：拆为 (i)–(k)–(j)；Δc = d(i,k)+d(k,j)−d(i,j)。</text>
  <g transform="translate(0, 50)">
    <circle cx="100" cy="80" r="8" fill="#5c5c5c" />
    <text x="92" y="85" font-size="12" fill="#fff" font-weight="600">i</text>
    <circle cx="300" cy="80" r="8" fill="#5c5c5c" />
    <text x="292" y="85" font-size="12" fill="#fff" font-weight="600">j</text>
    <line x1="108" y1="80" x2="292" y2="80" stroke="#1976d2" stroke-width="2.5" marker-end="url(#mIns)" />
  </g>
  <g transform="translate(0, 50)">
    <circle cx="100" cy="140" r="8" fill="#5c5c5c" />
    <text x="92" y="145" font-size="12" fill="#fff" font-weight="600">i</text>
    <circle cx="200" cy="140" r="8" fill="#2e7d32" />
    <text x="194" y="145" font-size="11" fill="#fff" font-weight="600">k</text>
    <circle cx="300" cy="140" r="8" fill="#5c5c5c" />
    <text x="292" y="145" font-size="12" fill="#fff" font-weight="600">j</text>
    <line x1="108" y1="140" x2="192" y2="140" stroke="#2e7d32" stroke-width="2" marker-end="url(#mIns)" />
    <line x1="208" y1="140" x2="292" y2="140" stroke="#2e7d32" stroke-width="2" marker-end="url(#mIns)" />
  </g>
  <line x1="450" y1="0" x2="450" y2="230" stroke="#e0e0e0" />
  <g transform="translate(460, 38)">
    <polygon points="100,20 200,20 150,100" fill="none" stroke="#1976d2" stroke-width="2" />
    <text x="92" y="18" font-size="12" fill="#1976d2" font-weight="600">A</text>
    <text x="200" y="18" font-size="12" fill="#1976d2" font-weight="600">B</text>
    <text x="140" y="110" font-size="12" fill="#1976d2" font-weight="600">C</text>
    <line x1="100" y1="20" x2="200" y2="20" stroke="#b71c1c" stroke-width="2" />
    <text x="120" y="12" font-size="10" fill="#b71c1c">边 AB 可拆成 A–k–B</text>
    <circle cx="150" cy="50" r="7" fill="#2e7d32" />
    <text x="145" y="55" font-size="10" fill="#fff" font-weight="600">k</text>
    <line x1="100" y1="20" x2="143" y2="50" stroke="#2e7d32" stroke-width="1.5" stroke-dasharray="3 2" />
    <line x1="157" y1="50" x2="200" y2="20" stroke="#2e7d32" stroke-width="1.5" stroke-dasharray="3 2" />
  </g>
  <g transform="translate(460, 160)">
    <text x="0" y="0" font-size="11" fill="#555">环上实作应对每条可插弧 (i, j) 试算 Δc 并配合第三节的选择规则。</text>
  </g>
</svg>
<figcaption style="font-size:0.9em;color:#555;margin-top:0.25em">左：在一条弧上把 k 插入的抽象（上下两行表示插入前后）。右：三角子环在 AB 上「开口」接 k；闭合路径中还需保持与其余边的衔接。</figcaption>
</figure>

---

## 三、四种常见变体

「下一步选谁进环」与「在全体弧上选哪里最省」可以组合。下面四个是文献与实现里常见的「选择下一待插点」策略；插入位仍按上一节的 $\Delta c$ 在弧上求（或作后悔值等扩展；与 Regret 等的关系见 D 后一段的说明）。

### A. 最近插入（Nearest Insertion）

**逻辑**：在尚未进环的客户中，选与当前路线上任一点距离最近的那个作为下一步的 k。  
**特点**：优先把已离路很近的客户先接进环，路线在局部上常较紧凑。因始终在环上更新，与链式最近邻相比，更顾路径闭合。见 [贪心（构造式）](greedy-algorithm.md) 中最近邻与链式生长的对照。

### B. 最远插入（Farthest Insertion）

**逻辑**：在尚未进环的客户中，使 k 到「当前路线上各点的最短距离」取最大的那个，即最靠外的未进环点。  
**直觉**：先搭出外轮廓，减轻末期被迫拉长线去接远处点。多数入门叙述与工程经验认为，在以上四种简单选择规则中，最远插入往往最稳健、效果常较好；仍依实例与实现为准。  
**示意**：可想象一团已进环点与环外更远的 k，最远插入会优先接环外缘；最近插入更倾向贴住已有团簇。纸上画点即可对比。

### C. 最省插入 / 最廉插入（Cheapest Insertion）

**逻辑**：枚举所有未进环的 k 与当前环上所有可插弧 (i, j)，在全体 (k, i, j) 组合上取 $\Delta c(i,j,k)$ 全局长最小的那一步。  
**特点**：单步在谁与哪条弧上极度贪心，只在乎当步边际代价最小。实现上可比重，但单步计算量可较大。

### D. 随机插入（Random Insertion）

**逻辑**：从尚未进环的客户中随机选 k，再在弧的选取上依实现（可随机、可再取最小 $\Delta c$ 等）。  
**用途**：在 [GRASP](../meta/grasp.md)、[ALNS](../meta/alns.md) 等元启发式中增加多解、多样性，避免总是同一条构造序列。

**注**：另有一种 Regret 插入（次优与最优插入位置代价差大者优先），与 ALNS 修复常见，见 [ALNS](../meta/alns.md)。「随机化最廉」指在一步内对多个低 $\Delta c$ 位再随机，与 D 的「人随机」可组合，编码时建议分开写清。第三节标题「四种」是常见的入门分法，Regret 作扩展单列。

---

## 四、与 CVRP、ALNS 的关系

- CVRP 在「下一点插进哪条车、是否新开」上比 TSP 多一层，但弧上插一点的 $\Delta c$ 与容量、时间窗检查仍同型。  
- [ALNS](../meta/alns.md) 的修复算子是大邻域上反复插拔，不是本页从子环一次建满的纯构造，但插入增量同一套公式。  
- [Clarke–Wright 节约](clarke-wright-savings.md) 是边合并，不是向弧中塞点；可先 C-W 出粗解，再用插入抛光或作修复链。

**注**：子环与弧的存法、有向/无向、起点是否固定、并列最小 $\Delta c$ 时的决胜规则，应写在可复现说明中。
