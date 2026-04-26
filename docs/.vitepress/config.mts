import { defineConfig } from "vitepress";
import mathjax3 from "markdown-it-mathjax3";
import container from "markdown-it-container";

const BASE = "/Personal/";
/** 与换色/换标后递增，破 favicon/导航 logo 的强缓存 */
const LOGO_ASSET = `${BASE}logo.svg?v=2`;

export default defineConfig({
  title: "个人知识库",
  description: "运筹优化与人工智能笔记",
  lang: "zh-CN",
  base: BASE,

  appearance: true,
  lastUpdated: true,

  head: [
    ["link", { rel: "icon", href: LOGO_ASSET, type: "image/svg+xml" }],
    ["link", { rel: "apple-touch-icon", href: LOGO_ASSET }],
    ["meta", { name: "theme-color", content: "#1976d2" }],
  ],

  markdown: {
    theme: { light: "github-light", dark: "github-dark" },
    lineNumbers: true,
    config: (md) => {
      md.use(mathjax3);
      // 自定义 algorithm 容器
      md.use(container, "algorithm", {
        render(tokens, idx, _options, env) {
          const token = tokens[idx];
          const info = token.info.trim().slice("algorithm".length).trim();
          if (token.nesting === 1) {
            const title = info || "算法流程";
            return `<div class="custom-block algorithm"><p class="custom-block-title">▶ ${title}</p>\n`;
          } else {
            return `</div>\n`;
          }
        },
      });
    },
  },

  themeConfig: {
    logo: { src: "/logo.svg?v=2", alt: "知识库" },

    editLink: {
      pattern: "https://github.com/yupli/Personal/edit/main/docs/:path",
      text: "在 GitHub 上编辑此页",
    },

    lastUpdated: {
      text: "更新于",
      formatOptions: { dateStyle: "medium", timeStyle: "short" },
    },

    nav: [
      { text: "首页", link: "/" },
      { text: "运筹优化", link: "/or-opt/", activeMatch: "/or-opt/" },
      { text: "人工智能", link: "/ai/", activeMatch: "/ai/" },
    ],

    sidebar: {
      "/or-opt/": [
        { text: "运筹优化", link: "/or-opt/" },
        {
          text: "建模方法",
          collapsed: false,
          items: [
            { text: "整数规划建模技巧", link: "/or-opt/modeling/integer-modeling-techniques" },
          ],
        },
        {
          text: "经典问题数学模型",
          collapsed: false,
          items: [
            { text: "指派问题", link: "/or-opt/classic-models/assignment-problem" },
            { text: "最短路问题", link: "/or-opt/classic-models/shortest-path-problem" },
            { text: "最大流问题", link: "/or-opt/classic-models/max-flow-problem" },
            {
              text: "最优整数解特性与幺模矩阵",
              link: "/or-opt/classic-models/integer-solutions-unimodular-matrices",
            },
            { text: "多商品网络流问题", link: "/or-opt/classic-models/multicommodity-network-flow" },
            { text: "多商品流运输问题", link: "/or-opt/classic-models/multicommodity-transportation" },
            { text: "设施选址问题", link: "/or-opt/classic-models/facility-location" },
            { text: "旅行商问题", link: "/or-opt/classic-models/traveling-salesman-problem" },
            { text: "车辆路径规划问题", link: "/or-opt/classic-models/vehicle-routing-problem" },
          ],
        },
        {
          text: "精确算法",
          link: "/or-opt/exact/exact-algorithms",
          collapsed: false,
          items: [
            { text: "分支定界（B&B）", link: "/or-opt/exact/branch-and-bound" },
            { text: "分支切割（B&C）", link: "/or-opt/exact/branch-and-cut" },
            { text: "列生成（Column Generation）", link: "/or-opt/exact/column-generation" },
            { text: "分支定价（B&P）", link: "/or-opt/exact/branch-and-price" },
            { text: "分支定价切割（BPC）", link: "/or-opt/exact/branch-price-and-cut" },
            { text: "Dantzig-Wolfe分解", link: "/or-opt/exact/dantzig-wolfe" },
            { text: "Benders分解", link: "/or-opt/exact/benders" },
            { text: "拉格朗日", link: "/or-opt/exact/lagrangian" },
          ],
        },
        {
          text: "启发式算法",
          link: "/or-opt/heuristics/heuristic-algorithms",
          collapsed: false,
          items: [
            {
              text: "基础启发式（Simple Heuristics）",
              link: "/or-opt/heuristics/simple/simple-heuristics",
              collapsed: false,
              items: [
                { text: "贪心（构造式）", link: "/or-opt/heuristics/simple/greedy-algorithm" },
                { text: "插入启发式", link: "/or-opt/heuristics/simple/insertion-heuristics" },
                { text: "Clarke–Wright 节约", link: "/or-opt/heuristics/simple/clarke-wright-savings" },
                { text: "爬山（Hill Climbing）", link: "/or-opt/heuristics/simple/hill-climbing" },
                { text: "2-opt / 3-opt / k-opt", link: "/or-opt/heuristics/simple/k-opt" },
              ],
            },
            {
              text: "元启发式（Metaheuristics）",
              link: "/or-opt/heuristics/metaheuristics",
              collapsed: false,
              items: [
                { text: "模拟退火（SA）", link: "/or-opt/heuristics/meta/simulated-annealing" },
                { text: "禁忌搜索（TS）", link: "/or-opt/heuristics/meta/tabu-search" },
                { text: "遗传算法（GA）", link: "/or-opt/heuristics/meta/genetic-algorithm" },
                { text: "变邻域搜索（VNS）", link: "/or-opt/heuristics/meta/vns" },
                { text: "迭代局部搜索（ILS）", link: "/or-opt/heuristics/meta/iterated-local-search" },
                { text: "贪婪随机自适应搜索过程（GRASP）", link: "/or-opt/heuristics/meta/grasp" },
                { text: "粒子群（PSO）", link: "/or-opt/heuristics/meta/particle-swarm-optimization" },
                { text: "蚁群（ACO）", link: "/or-opt/heuristics/meta/ant-colony-optimization" },
                { text: "自适应大邻域（ALNS）", link: "/or-opt/heuristics/meta/alns" },
              ],
            },
            { text: "超启发式（Hyper-heuristics）", link: "/or-opt/heuristics/hyper-heuristics" },
          ],
        },
        {
          text: "图算法",
          collapsed: false,
          items: [
            { text: "Dijkstra", link: "/or-opt/graph/dijkstra" },
            { text: "Bellman-Ford", link: "/or-opt/graph/bellman-ford" },
          ],
        },
      ],
      "/ai/": [{ text: "人工智能", link: "/ai/" }],
    },

    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: "搜索", buttonAriaLabel: "搜索文档" },
              modal: {
                noResultsText: "未找到结果",
                resetButtonTitle: "清除",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
        },
      },
    },

    /* h2–h4 纳入侧栏目录，长文好跳转 */
    outline: { label: "本页目录", level: [2, 4] },

    docFooter: { prev: "上一篇", next: "下一篇" },

    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "外观",
    lightModeSwitchTitle: "浅色",
    darkModeSwitchTitle: "深色",

    socialLinks: [
      { icon: "github", link: "https://github.com/yupli/Personal" },
    ],

    footer: {
      message: "个人笔记",
      copyright: "Copyright © yupli",
    },
  },
});
