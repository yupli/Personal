# 运筹优化

在此目录下添加线性/整数规划、组合优化、仿真、供应链等笔记 Markdown 文件。

例如新建 `docs/or-opt/lp.md` 后，在 `docs/.vitepress/config.mts` 里为 `/or-opt/` 侧边栏追加：

```ts
{ text: "线性规划备忘", link: "/or-opt/lp" },
```

（`link` 与文件名一致，不含 `.md`。）
