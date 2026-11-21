import { computed, onMounted, ref } from "vue";
export type ReadingItem = { path:string; title:string; section?:string };
const catalog = ref<ReadingItem[]>([]);
const current = ref<ReadingItem | null>(null);
const key = "personal-reading-v1";
let loaded = false;
function valid(item:any): item is ReadingItem {
  return !!item && typeof item.title==="string" && typeof item.path==="string" &&
    /^\/(?:or-opt|reinforcement-learning)\/[a-zA-Z0-9/_-]+\.html$/.test(item.path) &&
    (item.section===undefined || typeof item.section==="string");
}
function load() {
  if (loaded) return;
  loaded=true;
  try {
    const data=JSON.parse(localStorage.getItem(key) ?? "{}");
    catalog.value=Array.isArray(data.saved)?data.saved.filter(valid).slice(0,16):[];
    current.value=valid(data.recent)?data.recent:null;
  } catch {}
}
function save() {
  try { localStorage.setItem(key,JSON.stringify({saved:catalog.value,recent:current.value})); } catch {}
}
export function useReading() {
  onMounted(load);
  return {
    saved:computed(()=>catalog.value), recent:computed(()=>current.value),
    record(item:ReadingItem) { load(); if(valid(item)){current.value=item;save();} },
    toggle(item:ReadingItem) {
      load(); if(!valid(item))return;
      if(catalog.value.some(x=>x.path===item.path))catalog.value=catalog.value.filter(x=>x.path!==item.path);
      else catalog.value=[item,...catalog.value].slice(0,16);
      save();
    },
    clear() { catalog.value=[];current.value=null;save(); }
  };
}
