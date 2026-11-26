export const courseSlidesUrl = "https://github.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning/tree/main/Lecture%20slides";

export const lessonList = [
  ["basic-concepts", "基本概念"],
  ["bellman-equation", "贝尔曼公式"],
  ["bellman-optimality", "贝尔曼最优公式"],
  ["value-policy-iteration", "值迭代与策略迭代"],
  ["monte-carlo", "蒙特卡洛方法"],
  ["stochastic-approximation", "随机近似与随机梯度下降"],
  ["temporal-difference", "时序差分方法"],
  ["value-function-approximation", "价值函数近似"],
] as const;

export function lessonInfo(path: string) {
  const match = /(?:^|\/)reinforcement-learning\/([^/]+?)(?:\.(?:html|md))?$/.exec(path);
  if (!match) return;
  const index = lessonList.findIndex(([slug]) => slug === match[1]);
  if (index < 0) return;
  return { index, title: lessonList[index][1] };
}

export function lessonLink(index: number) {
  return "/reinforcement-learning/" + lessonList[index][0] + ".html";
}
