<script setup lang="ts">
import { useReading, type ReadingItem } from "../reading";
import { withBase } from "vitepress";
const reading=useReading();
const { recent, saved }=reading;
const href=(item:ReadingItem)=>withBase(item.path)+(item.section?"#"+encodeURIComponent(item.section):"");
</script>

<template>
  <section v-if="recent || saved.length" class="pk-shelf" aria-label="本机阅读记录">
    <div class="pk-dialog-bar"><h2>我的阅读</h2><button type="button" class="pk-btn" @click="reading.clear()">清除本机记录</button></div>
    <p v-if="recent"><strong>继续阅读：</strong><a :href="href(recent)">{{recent.title}}</a></p>
    <ul v-if="saved.length" class="pk-saved">
      <li v-for="item in saved" :key="item.path"><a :href="href(item)">{{item.title}}</a><button type="button" class="pk-btn" :aria-label="'取消收藏 '+item.title" @click="reading.toggle(item)">移除</button></li>
    </ul>
    <small class="pk-muted">阅读记录和收藏仅保存在当前浏览器。</small>
  </section>
</template>
