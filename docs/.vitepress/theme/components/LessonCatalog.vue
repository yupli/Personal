<script setup lang="ts">
import { withBase } from "vitepress";
import { courseSlidesUrl, lessonLink, lessonList } from "../../lessons";
</script>

<template>
  <ol class="pk-lesson-list" role="list">
    <li v-for="([slug, title], index) in lessonList" :key="slug">
      <a :href="withBase(lessonLink(index))">第 {{ index + 1 }} 课 · {{ title }}</a>
    </li>
    <li><a :href="withBase('/reinforcement-learning/appendix.html')">附录</a></li>
    <li><a :href="courseSlidesUrl">课件</a></li>
  </ol>
</template>
