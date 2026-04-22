<template>
  <div class="article-list">
    <div class="articles">
      <a v-for="article in articles" :key="article.id" :href="article.link" class="article-item">
        <div class="article-meta">{{ article.date }}</div>
        <div class="article-title">{{ article.title }}</div>
      </a>
    </div>
  </div>
</template>

<script setup>
const articles = [
  { id: 1, title: '忙碌之际的文字', date: '2024年04月13日', link: '/essays/articles/article-001' },
  { id: 2, title: '《我与地坛》最后一句的理解', date: '2024年02月08日', link: '/essays/articles/article-002' },
  { id: 3, title: '23.11-12月纪录与总结', date: '2023年12月30日', link: '/essays/articles/article-003' },
  { id: 4, title: '23.10月纪录与总结', date: '2023年11月05日', link: '/essays/articles/article-004' },
  { id: 5, title: '听国奖答辩后', date: '2023年10月08日', link: '/essays/articles/article-005' },
  { id: 6, title: '记一个雨夜', date: '2023年10月02日', link: '/essays/articles/article-006' },
  { id: 7, title: '23.九月开学篇(1)', date: '2023年10月01日', link: '/essays/articles/article-007' },
  { id: 8, title: '23.2&3月记录与总结', date: '2023年04月04日', link: '/essays/articles/article-008' },
  { id: 9, title: '我的2022', date: '2022年12月31日', link: '/essays/articles/article-009' },
  { id: 10, title: '书后思', date: '2022年12月24日', link: '/essays/articles/article-010' },
  { id: 11, title: '22.10&11月记录与总结', date: '2022年12月07日', link: '/essays/articles/article-011' },
]
</script>

<style scoped>
.article-list {
  margin-top: 2rem;
}

.articles {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-item {
  padding: 1rem 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: all 0.2s;
  text-decoration: none;
}

.article-item:hover {
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-bg-soft);
}

.article-meta {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.25rem;
}

.article-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}
</style>
