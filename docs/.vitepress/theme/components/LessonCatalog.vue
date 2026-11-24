<script setup lang="ts">
import { withBase } from "vitepress";
import { lessonHasSlides, lessonLink, lessonList } from "../../lessons";
</script>

<template>
  <ol class="pk-lesson-list" role="list">
    <li v-for="([slug, title], index) in lessonList" :key="slug">
      <strong>第 {{ index + 1 }} 课 · {{ title }}</strong>
      <div class="pk-lesson-links">
        <a v-if="lessonHasSlides(index)" class="pk-btn" :href="withBase(lessonLink(index, true))" :aria-label="`${title} · V1（逐页）`">V1（逐页）</a>
        <a class="pk-btn" :href="withBase(lessonLink(index, false))" :aria-label="`${title} · V2（总结）`">V2（总结）</a>
      </div>
    </li>
  </ol>
</template>
