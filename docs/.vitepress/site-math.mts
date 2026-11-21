type Rule = (...args: any[]) => string;
type Renderer = { rules: Record<string, Rule>; render: Rule };
type Markdown = { renderer: Renderer };

const escapeAttribute = (text: string) => text.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("\n","&#10;");

export function enhanceMath(md: Markdown) {
  const { renderer } = md;
  const block = renderer.rules.math_block;
  if (!block) return;
  renderer.rules.math_block = (tokens, index, ...args) =>
    block(tokens,index,...args).replace("<mjx-container ", '<mjx-container data-tex="'+escapeAttribute(tokens[index].content.trim())+'" ');

  const render = renderer.render.bind(renderer);
  renderer.render = (...args) => {
    const html = render(...args);
    const pattern = /<mjx-container\b[\s\S]*?<\/mjx-container>/g;
    const counts = new Map<string, number>();
    const glyph = /<path\b([^<>]*?)\bd="([^"]+)"([^<>]*?)(?:\/>|><\/path>)/g;
    for (const match of html.matchAll(pattern)) {
      for (const p of match[0].matchAll(glyph)) counts.set(p[2], (counts.get(p[2]) ?? 0) + 1);
    }
    const ids = new Map([...counts].filter(([d,n]) => d.length > 100 && n > 1).map(([d],i) => [d,"pk-glyph-"+i]));
    if (!ids.size) return html;
    const defs = [...ids].map(([d,id]) => '<path id="'+id+'" d="'+d+'"></path>').join("");
    return '<svg class="site-math-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="0" height="0"><defs>'+defs+'</defs></svg>\n'
      +html.replace(pattern, math => math.replace(glyph, (tag,before,d,after) =>
        ids.has(d) ? '<use'+before+'href="#'+ids.get(d)+'"'+after+'></use>' : tag));
  };
}
