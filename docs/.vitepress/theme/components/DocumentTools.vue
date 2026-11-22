<script setup lang="ts">
import { nextTick, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vitepress";
import { lessonInfo } from "../../lessons";

const route=useRoute();
const lightbox=ref<HTMLDialogElement>();
const image=ref({src:"",alt:""});
let imageTrigger:HTMLElement|undefined;
let resize:ResizeObserver|undefined;
let mutation:MutationObserver|undefined;
let rebuildTimer:number|undefined;
let built:HTMLElement|undefined;
let buildFrame=0;
let builtRoute="";
function show(img:HTMLImageElement,button:HTMLElement) {
  image.value={src:img.currentSrc||img.src,alt:img.alt};
  imageTrigger=button;
  lightbox.value?.showModal();
}
function note(text:string) {
  const el=document.createElement("div");
  el.className="pk-scroll-note";
  el.textContent=text;
  return el;
}
function setScrollable(el:HTMLElement,label:string,wide:boolean) {
  if(wide) {
    el.tabIndex=0;
    el.setAttribute("aria-label",label+"，可横向滚动");
  } else {
    el.removeAttribute("tabindex");
    el.removeAttribute("aria-label");
  }
}
function addResizeHint(el:HTMLElement,label:string,tools:HTMLElement) {
  const hint=note("可横向滑动"); tools.prepend(hint);
  const update=()=>{
    const wide=el.scrollWidth>el.clientWidth+3;
    hint.hidden=!wide;
    setScrollable(el,label,wide);
  };
  update();
  const target=el.firstElementChild;
  resize?.observe(el);
  if(target instanceof Element)resize?.observe(target);
  observeResize.set(el,update);
  if(target instanceof Element) observeResize.set(target,update);
}
const observeResize=new Map<Element,()=>void>();
function narrowComparison(doc:HTMLElement) {
  const table=[...doc.querySelectorAll<HTMLTableElement>("table")].find(el=>el.tHead?.textContent?.includes("Policy Iteration")&&el.tHead.textContent.includes("Value Iteration")&&el.rows.length===6);
  if(!table)return;
  table.classList.add("pk-comparison-table");
  const groups=document.createElement("div");
  groups.className="pk-comparison-mobile pk-enhancement";
  for(const row of Array.from(table.tBodies[0].rows)) {
    const group=document.createElement("details");
    const head=document.createElement("summary");head.textContent=row.cells[0].textContent;
    group.append(head);
    for(let i=1;i<row.cells.length;i++){
      const label=document.createElement("strong");label.textContent=table.tHead!.rows[0].cells[i].textContent;
      const text=document.createElement("div");
      for(const child of Array.from(row.cells[i].childNodes))text.append(child.cloneNode(true));
      group.append(label,text);
    }
    if (row===table.tBodies[0].rows[3]) group.open=true;
    groups.append(group);
  }
  const tools=table.nextElementSibling;
  if(tools?.classList.contains("pk-inline-tools"))tools.after(groups);
  else table.after(groups);
}
function decorate() {
  const doc=document.querySelector<HTMLElement>("main .vp-doc");
  const navLabel=document.getElementById("main-nav-aria-label");
  if(navLabel&&navLabel.textContent!=="主导航")navLabel.textContent="主导航";
  document.querySelector('button[aria-label="mobile navigation"]')?.setAttribute("aria-label","打开或关闭主导航");
  for(const card of document.querySelectorAll(".VPFeature[href]")){
    const heading=card.querySelector("h2")?.textContent?.trim();
    if(heading)card.setAttribute("aria-label","浏览"+heading);
  }
  if(!doc||doc===built&&builtRoute===route.path)return;
  built=doc; builtRoute=route.path;
  doc.querySelectorAll(".pk-enhancement").forEach(el=>el.remove());
  doc.querySelectorAll(".pk-comparison-table").forEach(el=>el.classList.remove("pk-comparison-table"));
  for(const link of doc.querySelectorAll<HTMLAnchorElement>(".header-anchor")){
    const old=link.getAttribute("aria-label")?.match(/^Permalink to "(.+)"$/);
    if(old)link.setAttribute("aria-label","跳转到："+old[1]);
  }
  resize?.disconnect();observeResize.clear();
  for(const el of doc.querySelectorAll<HTMLElement>('mjx-container[display="true"], table')){
    const tools=document.createElement("div");tools.className="pk-inline-tools pk-enhancement";el.after(tools);
    addResizeHint(el,el.matches("table")?"表格":"公式",tools);
  }
  narrowComparison(doc);
  for(const el of doc.querySelectorAll<HTMLElement>("mjx-container:not([display]):not(table mjx-container)")){
    const glyph=el.querySelector(":scope > svg");
    if(!glyph)continue;
    const update=()=>{
      const wide=glyph.getBoundingClientRect().width>el.getBoundingClientRect().width+1;
      el.classList.toggle("pk-wide-math",wide);
      setScrollable(el,"公式",wide);
    };
    update();
    observeResize.set(el,update);
    resize?.observe(el);
  }
  const isSlides=lessonInfo(route.path)?.slides;
  for(const img of doc.querySelectorAll<HTMLImageElement>("img")){
    if(img.closest("a, button") || !img.alt)continue;
    const button=document.createElement("button");button.type="button";
    button.setAttribute("aria-label","放大原图："+img.alt);
    button.setAttribute("aria-haspopup","dialog");
    button.addEventListener("click",()=>show(img,button));
    if(isSlides){
      button.className="pk-zoom-image";
      img.before(button);
      button.append(img);
    } else {
      button.className="pk-btn pk-zoom-trigger pk-enhancement";
      button.textContent="放大原图";
      img.after(button);
    }
  }
}
function schedule() {
  cancelAnimationFrame(buildFrame); buildFrame=requestAnimationFrame(decorate);
}
watch(()=>route.path,()=>{
 lightbox.value?.close();builtRoute="";
 nextTick(()=>{schedule();window.clearTimeout(rebuildTimer);rebuildTimer=window.setTimeout(schedule,300);});
});
onMounted(()=>{
 resize=new ResizeObserver(entries=>entries.forEach(x=>observeResize.get(x.target)?.()));
 mutation=new MutationObserver(()=>{if(document.querySelector("main .vp-doc")!==built)schedule();});
 mutation.observe(document.getElementById("VPContent")??document.body,{subtree:true,childList:true});
 schedule();
});
onBeforeUnmount(()=>{resize?.disconnect();mutation?.disconnect();cancelAnimationFrame(buildFrame);clearTimeout(rebuildTimer);});
</script>

<template>
  <dialog ref="lightbox" class="pk-dialog pk-image-dialog" aria-label="原图预览" @click.self="lightbox?.close()" @close="imageTrigger?.focus()">
    <div class="pk-dialog-inner">
      <div class="pk-dialog-bar"><a :href="image.src" target="_blank" rel="noopener">在新页面查看原图</a><button type="button" class="pk-btn" autofocus @click="lightbox?.close()">关闭</button></div>
      <img v-if="image.src" :src="image.src" :alt="image.alt">
    </div>
  </dialog>
</template>
