import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, join, relative, resolve } from "node:path";
import ghPages from "gh-pages";

const manifest = ".personal-assets.json";
const ttl = 24 * 60 * 60 * 1000; // A day is longer than the Pages HTML cache.
const source = resolve(process.argv[2] || mkdtempSync(join(tmpdir(), "personal-pages-")));
if (!process.argv[2]) execFileSync(process.execPath, [
  "node_modules/vitepress/bin/vitepress.js","build","docs","--outDir",source,
], { stdio:"inherit" });
if (!existsSync(join(source,"index.html")) || !existsSync(join(source,"search-index.json"))) {
  throw new Error("A complete VitePress build with search-index.json is required.");
}

function files(dir) {
  return readdirSync(dir,{recursive:true,withFileTypes:true}).filter(x=>x.isFile()).map(x=>
    relative(dir,join(x.parentPath ?? x.path,x.name)).replaceAll("\\","/"));
}
const built = new Set(files(source));
const assets = new Set([...built].filter(x=>x.startsWith("assets/")));
const keepSpecial = new Set([".nojekyll", "CNAME", manifest]);
const safeAsset = name => /^assets\/(?:[\w.-]+\/)*[\w.-]+$/.test(name) && !name.split("/").includes("..");
const legacy = {};
await ghPages.publish(source, {
  add:true, nojekyll:true,
  beforeAdd(git) {
    const cwd = git.cwd;
    const now = Date.now();
    let previous;
    try { previous=JSON.parse(readFileSync(join(cwd,manifest),"utf8")); } catch {}
    const tracked = execFileSync("git",["ls-files","-z"],{cwd, encoding:"utf8"}).split("\0").filter(Boolean);
    const priorAssets = Array.isArray(previous?.current)?previous.current:tracked.filter(safeAsset);
    for (const name of priorAssets) if(safeAsset(name)&&!assets.has(name)) legacy[name]=now+ttl;
    for(const [name,expiry] of Object.entries(previous?.legacy ?? {})){
      if(safeAsset(name)&&!assets.has(name)&&!legacy[name]&&Number.isFinite(expiry)&&expiry>now)legacy[name]=expiry;
    }
    for (const name of tracked) {
      if (built.has(name)||keepSpecial.has(name)||legacy[name])continue;
      const file=resolve(cwd,name);
      const rel=relative(cwd,file);
      if(!rel||rel.startsWith("..")||isAbsolute(rel))throw new Error("Unexpected deployment path: "+name);
      if(existsSync(file))unlinkSync(file);
    }
    writeFileSync(join(cwd,manifest),JSON.stringify({ current:[...assets],legacy }));
  },
});
console.log("Published; retained",Object.keys(legacy).length,"previous assets for open sessions.");
