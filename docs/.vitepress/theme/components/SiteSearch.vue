<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, withBase } from "vitepress";
import { normalizeSearch, searchParts } from "../search-excerpt";

type SearchDoc = { title:string; path:string; area:string; version:string; sections:{id:string;title:string;text:string}[] };
const dialog = ref<HTMLDialogElement>();
const input = ref<HTMLInputElement>();
const trigger = ref<HTMLButtonElement>();
const query = ref("");
const composing = ref(false);
const area = ref("");
const version = ref("");
const index = ref<SearchDoc[]>([]);
const state = ref<"idle"|"loading"|"error"|"ready">("idle");
const route = useRoute();
const results = computed(() => {
  const terms = [...new Set(normalizeSearch(query.value).split(/\s+/).filter(Boolean))];
  if (!terms.length) return [];
  return index.value.flatMap(doc => {
    if (area.value && doc.area !== area.value || version.value && doc.version !== version.value) return [];
    const title = normalizeSearch(doc.title);
    return doc.sections.map(section => {
      const heading = normalizeSearch(section.title), body = normalizeSearch(section.text);
      const score = terms.reduce((sum,t) => sum + (heading.includes(t) ? 12 : title.includes(t) ? 8 : body.includes(t) ? 2 : 0),0);
      return {doc,section,score,match:terms.every(t=>heading.includes(t)||title.includes(t)||body.includes(t))};
    }).filter(r=>r.match).sort((a,b)=>b.score-a.score).slice(0,2);
  }).sort((a,b)=>b.score-a.score || Number(b.doc.version==="v2")-Number(a.doc.version==="v2"))
    .slice(0,20)
    .map(({ doc, section }) => ({
      doc,
      section,
      title: searchParts(doc.title, terms),
      heading: searchParts(section.title, terms),
      excerpt: searchParts(section.text, terms, true),
    }));
});

async function load() {
  if (state.value === "loading" || state.value === "ready") return;
  state.value = "loading";
  try {
    const response = await fetch(withBase("/search-index.json"), {cache:"no-cache", signal:AbortSignal.timeout(8000)});
    if (!response.ok) throw new Error("Search index unavailable");
    index.value = await response.json();
    state.value = "ready";
  } catch { state.value = "error"; }
}
function open() {
  if (!dialog.value?.open) dialog.value?.showModal();
  nextTick(()=>input.value?.focus());
  void load();
}
function isCompositionKey(e: KeyboardEvent) {
  // Some browsers end composition before dispatching the confirming keydown.
  return composing.value || e.isComposing || e.keyCode === 229;
}
function shortcut(e:KeyboardEvent) {
  if (isCompositionKey(e)) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==="k") { e.preventDefault(); open(); }
}
function goToFirst(e:KeyboardEvent) {
  if (isCompositionKey(e)) return;
  if (e.key === "Escape") {
    e.preventDefault();
    dialog.value?.close();
    return;
  }
  if (e.key === "ArrowDown") {
    const first = dialog.value?.querySelector<HTMLElement>(".pk-search-results a");
    if (first) { e.preventDefault(); first.focus(); }
  } else if (e.key === "Enter") {
    const first = dialog.value?.querySelector<HTMLAnchorElement>(".pk-search-results a");
    if (first) { e.preventDefault(); first.click(); }
  }
}
function focusResult(e:KeyboardEvent) {
  if (isCompositionKey(e)) return;
  if (e.key!=="ArrowUp" && e.key!=="ArrowDown") return;
  const links=[...(dialog.value?.querySelectorAll<HTMLAnchorElement>(".pk-search-results a") ?? [])];
  const i=links.indexOf(document.activeElement as HTMLAnchorElement);
  if(i<0) return;
  e.preventDefault();
  const next=i+(e.key==="ArrowDown"?1:-1);
  if(next<0) input.value?.focus();
  else links[Math.min(next,links.length-1)]?.focus();
}
function resultLink(doc:SearchDoc, id:string) {
  return withBase("/" + doc.path) + (id ? "#" + encodeURIComponent(id) : "");
}
watch(()=>route.path,()=>dialog.value?.close());
onMounted(()=>window.addEventListener("keydown",shortcut));
onBeforeUnmount(()=>window.removeEventListener("keydown",shortcut));
</script>

<template>
  <button ref="trigger" type="button" class="pk-btn pk-search-trigger" aria-label="搜索文档" aria-haspopup="dialog" @click="open">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg>
    <span>搜索</span><kbd>Ctrl K</kbd>
  </button>
  <dialog ref="dialog" class="pk-dialog pk-search-dialog" aria-labelledby="pk-search-heading" @close="trigger?.focus()" @click.self="dialog?.close()">
    <div class="pk-dialog-inner">
      <div class="pk-dialog-bar"><h2 id="pk-search-heading">搜索笔记</h2><button type="button" class="pk-btn" @click="dialog?.close()">关闭</button></div>
      <input ref="input" class="pk-input" v-model="query" type="search" aria-label="搜索关键词" placeholder="例如：贝尔曼、BOE、单纯形法" @keydown="goToFirst" @compositionstart="composing = true" @compositionend="composing = false" @blur="composing = false">
      <div class="pk-filters">
        <label>板块 <select class="pk-input" v-model="area" @change="area !== 'rl' && (version='')"><option value="">全部</option><option value="or">运筹优化</option><option value="rl">强化学习</option></select></label>
        <label>版本 <select class="pk-input" v-model="version" :disabled="area==='or'"><option value="">全部</option><option value="v1">V1（逐页）</option><option value="v2">V2（总结）</option></select></label>
      </div>
      <p role="status" v-if="state==='loading'">正在加载搜索索引…</p>
      <p v-else-if="state==='error'" role="status">暂时无法加载搜索索引。 <button type="button" class="pk-btn" @click="load">重试</button></p>
      <p v-else-if="!query.trim()">输入关键词，可用 ↑ ↓ 切换结果。</p>
      <p v-else-if="!results.length" role="status">未找到匹配内容。可以换一个词或放宽筛选。</p>
      <template v-else>
        <p class="pk-muted" role="status">显示 {{results.length}} 条匹配</p>
        <ul class="pk-search-results" @keydown="focusResult">
          <li v-for="{doc,section,title,heading,excerpt} in results" :key="doc.path+'#'+section.id">
            <a :href="resultLink(doc,section.id)" @click="dialog?.close()">
              <small><template v-for="(part,i) in title" :key="i"><mark v-if="part.match">{{ part.text }}</mark><template v-else>{{ part.text }}</template></template></small>
              <strong v-if="heading.length"><template v-for="(part,i) in heading" :key="i"><mark v-if="part.match">{{ part.text }}</mark><template v-else>{{ part.text }}</template></template></strong>
              <span v-if="excerpt.length" class="pk-search-excerpt"><template v-for="(part,i) in excerpt" :key="i"><mark v-if="part.match">{{ part.text }}</mark><template v-else>{{ part.text }}</template></template></span>
            </a>
          </li>
        </ul>
      </template>
    </div>
  </dialog>
</template>
