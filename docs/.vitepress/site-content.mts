import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

function plain(s: string) {
  const entities: Record<string,string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'" };
  return s.replace(/<mjx-container\b[\s\S]*?<\/mjx-container>|<svg\b[\s\S]*?<\/svg>/g, " ")
    .replace(/<img\b[^>]*\balt="([^"]*)"[^>]*>/g, " $1 ")
    .replace(/<[^>]*>/g, " ").replace(/&([#\w]+);/g, (m,k) => entities[k] ?? m)
    .replace(/\s+/g, " ").trim();
}

export async function writeSearchIndex(outDir: string) {
  const files = (await readdir(outDir, { recursive: true })).filter(f => f.endsWith(".html") && f !== "404.html").sort();
  const docs = await Promise.all(files.map(async file => {
    const path = file.replaceAll("\\", "/");
    const html = await readFile(join(outDir,file), "utf8");
    const body = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
    const title = plain(html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "").replace(/ \| 个人知识库$/, "");
    const headings = [...body.matchAll(/<h[2-4]\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h[2-4]>/g)];
    return {
      title, path: path.replace(/(?:^|\/)index\.html$/, match => match.startsWith("/") ? "/" : ""),
      area: path.startsWith("reinforcement-learning/") ? "rl" : path.startsWith("or-opt/") ? "or" : "home",
      sections: [
        { id:"", title:"", text:plain(body.slice(0,headings[0]?.index ?? body.length)) },
        ...headings.map((h,i) => ({
          id:h[1], title:plain(h[2].replace(/<a\b[^>]*class="header-anchor"[\s\S]*?<\/a>/g, "")),
          text:plain(body.slice(h.index!+h[0].length,headings[i+1]?.index ?? body.length))
        }))
      ]
    };
  }));
  await writeFile(join(outDir,"search-index.json"),JSON.stringify(docs));
}
