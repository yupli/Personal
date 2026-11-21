<script setup lang="ts">
import { computed, ref, watch } from "vue";

const gamma=ref(.9), depth=ref(1), round=ref(0);
const values=ref<[number,number]>([0,0]);
const result=ref<{policy:[string,string]; value:[number,number]}[]>([]);
const actions=[
  [{name:"留在 A", reward:1, next:0},{name:"去 B",reward:0,next:1}],
  [{name:"留在 B", reward:2, next:1},{name:"去 A",reward:0,next:0}],
] as const;
function score(a:{reward:number;next:0|1},v:[number,number]) {return a.reward+gamma.value*v[a.next];}
function reset(){values.value=[0,0];round.value=0;result.value=[];}
function step(){
  if(round.value>=30)return;
  const v=values.value;
  const first=actions[0][Number(score(actions[0][1],v)>score(actions[0][0],v))];
  const second=actions[1][Number(score(actions[1][1],v)>score(actions[1][0],v))];
  let w:[number,number]=[...v];
  for(let j=0;j<depth.value;j++)w=[score(first,w),score(second,w)];
  values.value=w;round.value++;
  result.value=[...result.value,{policy:[first.name,second.name],value:w}];
}
const optimal=computed(()=>{const vb=2/(1-gamma.value);return [Math.max(1/(1-gamma.value),gamma.value*vb),vb]});
const show=(x:number)=>x.toFixed(3);
watch([gamma,depth],reset);
</script>

<template>
  <details class="pk-demo">
    <summary>小实验 · 调整折扣因子和每轮评估次数</summary>
    <p>A 可原地获奖励 1 或以奖励 0 去 B；B 可原地获奖励 2 或以奖励 0 去 A。转移确定，初始价值均为 0。每轮先按旧价值选动作，再固定策略更新指定次数。</p>
    <div class="pk-filters">
      <label>折扣因子 γ <input type="range" min="0" max="0.99" step=".01" v-model.number="gamma"><output>{{gamma.toFixed(2)}}</output></label>
      <label>评估次数 <select class="pk-input" v-model.number="depth"><option :value="1">1（值迭代）</option><option :value="2">2</option><option :value="5">5</option><option :value="10">10</option></select></label>
    </div>
    <div class="pk-dialog-bar">
      <button class="pk-btn" type="button" :disabled="round>=30" @click="step">下一轮</button>
      <button class="pk-btn" type="button" @click="reset">重置</button>
      <span role="status">第 {{round}} 轮：A = {{show(values[0])}}，B = {{show(values[1])}}</span>
    </div>
    <p class="pk-muted">最优价值：A = {{show(optimal[0])}}，B = {{show(optimal[1])}}。修改参数会从初值重新开始。</p>
    <ol v-if="result.length">
      <li v-for="(r,i) in result" :key="i">A：{{r.policy[0]}} → {{show(r.value[0])}}；B：{{r.policy[1]}} → {{show(r.value[1])}}</li>
    </ol>
  </details>
</template>
