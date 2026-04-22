<template>
  <div class="article-content">
    <div class="article-header">
      <a href="/essays/list.html" class="back-link">← 返回列表</a>
    </div>
    <SecureContent :ciphertext="ciphertext" :salt="salt" :iv="iv" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  articleId: {
    type: String,
    required: true
  }
})

// 文章内容配置（密文）
const articles = {
  'article-001': {
    ciphertext: '',
    salt: '',
    iv: ''
  }
}

const article = articles[props.articleId] || {}
const ciphertext = ref(article.ciphertext || '')
const salt = ref(article.salt || '')
const iv = ref(article.iv || '')
</script>

<style scoped>
.article-content {
  margin-top: 1rem;
}

.article-header {
  margin-bottom: 1.5rem;
}

.back-link {
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 0.95rem;
}

.back-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
