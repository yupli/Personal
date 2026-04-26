# 2-opt、3-opt 与 k-opt（TSP 上的 k 条边重连）

k-opt 是旅行商等路径问题上的改进式邻域：从一条可行环出发，删 k 条边、再用 k 条新边接回，得到同点集上另一条环。2-opt 与 3-opt 是其中最常用的两个特例。本页只讲算法本身：邻域与一步、配图、局搜主循环；与 [爬山](hill-climbing.md) 的衔接一句带过，总类见 [基础启发式](simple-heuristics.md)、[启发式算法总览](../heuristic-algorithms.md)。

**约定**：对称路长 d(u,v)=d(v,u)，目标为最小化总路长。对象为闭路。开路径 2-opt 的端点规则在实现中另定。

---

## 一、2-opt 在做什么

环上依走向为 …–v<sub>i</sub>–v<sub>i+1</sub>–…–v<sub>j</sub>–v<sub>j+1</sub>–…。删 (v<sub>i</sub>,v<sub>i+1</sub>)、(v<sub>j</sub>,v<sub>j+1</sub>) 两条不共用端点的边，改接 (v<sub>i</sub>,v<sub>j</sub>)、(v<sub>i+1</sub>,v<sub>j+1</sub>)，与把 v<sub>i+1</sub> 到 v<sub>j</sub> 的顶点段整段在序中反转再接上等价。新环点集与原来相同。

**意义**：2-opt 一步 = 在「换两条边」的邻域里比总长。反复做至不能改进，即相对 2-opt 的局部极；常用作单邻域的局搜子程序。

---

## 二、2-opt 示意图（六城）

在矩形外圈上设点 1、2、3 在底边，4、5、6 在上边，原环为 1→2→3→4→5→6→1。取 2-opt：删 (2,3)、(5,6)，接 (2,5)、(3,6)。左图在同坐标上画原环：蓝为保留弧，红虚线为本次要删的弧。右图仍用这六个坐标，新环可定为 1→2→5→4→3→6→1，绿为全部新弧。对照两图可看到两刀剪开、中间改向、再接上的过程，与程序里对一段下标做翻转一致。

<figure>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 150" width="100%" max-width="380" aria-label="2-opt 原外圈与待删两弧">
  <text x="0" y="14" font-size="12" fill="#333">外圈 1-2-3-4-5-6-1，红虚线 = 本步待删的 (2,3)、(5,6)</text>
  <g transform="translate(0, 20)">
    <g font-size="11" text-anchor="middle" fill="#fff" font-weight="600">
      <circle cx="50" cy="100" r="8" fill="#5c5c5c" /><text x="50" y="104">1</text>
      <circle cx="120" cy="100" r="8" fill="#5c5c5c" /><text x="120" y="104">2</text>
      <circle cx="190" cy="100" r="8" fill="#5c5c5c" /><text x="190" y="104">3</text>
      <circle cx="190" cy="30" r="8" fill="#5c5c5c" /><text x="190" y="34">4</text>
      <circle cx="120" cy="30" r="8" fill="#5c5c5c" /><text x="120" y="34">5</text>
      <circle cx="50" cy="30" r="8" fill="#5c5c5c" /><text x="50" y="34">6</text>
    </g>
    <g stroke-width="2" fill="none">
      <line x1="50" y1="100" x2="120" y2="100" stroke="#1976d2" />
      <line x1="120" y1="100" x2="190" y2="100" stroke="#c62828" stroke-dasharray="5 3" />
      <line x1="190" y1="100" x2="190" y2="30" stroke="#1976d2" />
      <line x1="190" y1="30" x2="120" y2="30" stroke="#1976d2" />
      <line x1="120" y1="30" x2="50" y2="30" stroke="#c62828" stroke-dasharray="5 3" />
      <line x1="50" y1="30" x2="50" y2="100" stroke="#1976d2" />
    </g>
  </g>
</svg>
<figcaption style="font-size:0.88em;color:#555">蓝实线为未删的弧。实现只比总长，不依赖图画风格。</figcaption>
</figure>

<figure>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 150" width="100%" max-width="380" aria-label="2-opt 新环 1-2-5-4-3-6-1">
  <text x="0" y="14" font-size="12" fill="#333">同六坐标：新环 1-2-5-4-3-6-1，绿为全部新弧</text>
  <g transform="translate(0, 20)">
    <g font-size="11" text-anchor="middle" fill="#fff" font-weight="600">
      <circle cx="50" cy="100" r="8" fill="#5c5c5c" /><text x="50" y="104">1</text>
      <circle cx="120" cy="100" r="8" fill="#5c5c5c" /><text x="120" y="104">2</text>
      <circle cx="190" cy="100" r="8" fill="#5c5c5c" /><text x="190" y="104">3</text>
      <circle cx="190" cy="30" r="8" fill="#5c5c5c" /><text x="190" y="34">4</text>
      <circle cx="120" cy="30" r="8" fill="#5c5c5c" /><text x="120" y="34">5</text>
      <circle cx="50" cy="30" r="8" fill="#5c5c5c" /><text x="50" y="34">6</text>
    </g>
    <g stroke-width="2" fill="none">
      <line x1="50" y1="100" x2="120" y2="100" stroke="#2e7d32" />
      <line x1="120" y1="100" x2="120" y2="30" stroke="#2e7d32" />
      <line x1="120" y1="30" x2="190" y2="30" stroke="#2e7d32" />
      <line x1="190" y1="30" x2="190" y2="100" stroke="#2e7d32" />
      <line x1="190" y1="100" x2="50" y2="30" stroke="#2e7d32" />
      <line x1="50" y1="30" x2="50" y2="100" stroke="#2e7d32" />
    </g>
  </g>
</svg>
<figcaption style="font-size:0.88em;color:#555">邻域扫时不必画图；O(n²) 量级是常见实现里按对 (i,j) 试 2-opt 的复杂度感。</figcaption>
</figure>

**注**：在图中读「反转」时，即把 v<sub>i+1</sub> 到 v<sub>j</sub> 的顶点段在环序中整段调转，与把一段下标在程序里做 reverse 同义；外侧仍为 v<sub>i</sub> 与 v<sub>j+1</sub> 的衔接方式。

---

## 三、3-opt 与 k-opt（与 2-opt 的差别）

- **3-opt**：一次换 3 条边。对称 TSP 上合法重连的型比 2-opt 多，一步邻域更大，有时能离开 2-opt 的局部最；但一步枚举和判重也重得多。常采用 2-opt 无改进再开 3-opt 等分层。  
- **k 较大时**：对固定 k 做完全枚举在规模上常不可行。实用代码多用 Lin–Kernighan 类按链逐步加长的换边，而不是对很大的 k 做全枚举。  
- **CVRP**：除路程外有容量、时间窗时，2-opt/3-opt 后若解不可行，本步拒收该邻居即可。

**注**：3-opt 在教材里常列多种重连图样；不放在本页展开，避免与 2-opt 的「一图说清」抢篇幅。

---

## 四、2-opt 局搜主过程

::: algorithm 2-opt 局搜（总路程最小化）
### 1. 输入
一条可行环、距离。点用数组、链表或前驱后继表均可，与下面翻转一段兼容即可。

### 2. 邻域扫与改进
在 2-opt 邻域中若存在能缩短总路程的换法，任取一合法 2-opt，更新点序，重复本步。可配合最陡/先改进与候选 (i, j) 的剪枝。

### 3. 无改进则停
若任一对 (i, j) 的 2-opt 都不能缩短总路程，当前解是 2-opt 局部极；可结束或把同一解交给 3-opt / 其它邻域。  
:::

**注**：上框只描述 2-opt 这一邻域的「到顶」子过程；[变邻域搜索](../meta/vns.md) 或 ILS 再在外层换邻域或扰动，是另一层循环，不写入本框。
