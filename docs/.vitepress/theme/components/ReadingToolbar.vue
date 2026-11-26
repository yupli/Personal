<script setup lang="ts">
import { computed, nextTick, onMounted, onBeforeUnmount, watch } from "vue";
import { useData } from "vitepress";
import { useReading } from "../reading";

const {page}=useData();
const reading=useReading();
const path=computed(()=>"/"+page.value.relativePath.replace(/\.md$/,".html"));
const isArticle=computed(()=>/^\/(?:or-opt|reinforcement-learning)\//.test(path.value)&&!path.value.endsWith("/index.html"));
const bookmark=computed(()=>reading.saved.value.some(x=>x.path===path.value));
let timer:number|undefined;
function record() {
  if(!isArticle.value)return;
  let section="";
  for(const heading of document.querySelectorAll<HTMLElement>(".vp-doc h2[id], .vp-doc h3[id], .vp-doc h4[id]")){
    if(heading.getBoundingClientRect().top>135)break;
    section=heading.id;
  }
  if(!section && location.hash) {
    try { section=decodeURIComponent(location.hash.slice(1)); } catch {}
  }
  reading.record({path:path.value,title:page.value.title,section});
}
function onScroll() {
  if (timer!==undefined) return;
  timer=window.setTimeout(()=>{timer=undefined;record();},250);
}
function update() { if(timer!==undefined){clearTimeout(timer);timer=undefined;} nextTick(()=>requestAnimationFrame(record)); }
onMounted(()=>{update();window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("pagehide",record);});
onBeforeUnmount(()=>{clearTimeout(timer);window.removeEventListener("scroll",onScroll);window.removeEventListener("pagehide",record);});
watch(()=>page.value.relativePath,update);
</script>

<template>
  <nav v-if="isArticle" class="pk-doc-tools" aria-label="笔记操作">
    <button type="button" class="pk-btn" :aria-pressed="bookmark" @click="reading.toggle({path,title:page.title})">{{bookmark?'取消收藏':'收藏本页'}}</button>
  </nav>
</template>
