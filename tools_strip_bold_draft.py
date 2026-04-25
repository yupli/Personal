import re
from pathlib import Path

# Match: start of line, optional - , **non-greedy label**, then ： or : (ASCII)
# Also handle **注**： etc. Label may include  / and （） if they're before ：
# Strategy: find all **...**; keep only if ** is immediately followed by  ： or : at end of bold section

def clean_line(s: str) -> str:
    def repl_bold(m):
        full = m.group(0)
        inner = m.group(1)
        return full
    # Remove all ** that are not "label" before ：
    # Simpler: remove every **  pair whose closing ** is not immediately before ： or : 
    # Actually: allowed pattern is **X**[optional unicode paren]： or **X**：
    out = s
    # Repeatedly find **  ** 
    i = 0
    result = []
    while i < len(s):
        if s[i:i+2] == '**' and (i==0 or s[i-1] != '*'):
            j = s.find('**', i+2)
            if j == -1:
                result.append(s[i:])
                break
            content = s[i+2:j]
            after = s[j+2:j+3]  # one char - might be ） before ：
            k = j + 2
            # skip optional （...）  before ：
            if k < len(s) and s[k] in '（(':
                depth = 0; kk = k
                while kk < len(s):
                    if s[kk] in '（(':
                        depth += 1
                    elif s[kk] in '）)':
                        depth -= 1
                        if depth == 0:
                            kk += 1
                            break
                    kk += 1
                if kk > k and kk <= len(s) and s[kk-1] in '）)':
                    k = kk
            if k < len(s) and s[k] in '：:':
                # keep bold
                result.append('**' + content + '**' + s[k])
                i = k + 1
                continue
            # not label before 冒号 - strip bold, keep content
            result.append(content)
            i = j + 2
            continue
        else:
            result.append(s[i])
            i += 1
    return ''.join(result)

# The above char-by-char is error-prone. Simpler approach:

def clean_markdown_text(text: str) -> str:
    lines = text.splitlines(keepends=True)
    out = []
    for line in lines:
        new_line = line
        # Find all **...**  segments
        def process_segment(line):
            pos = 0
            res = []
            while True:
                a = line.find('**', pos)
                if a == -1:
                    res.append(line[pos:])
                    return ''.join(res)
                res.append(line[pos:a])
                b = line.find('**', a+2)
                if b == -1:
                    res.append(line[a:])
                    return ''.join(res)
                content = line[a+2:b]
                rest = line[b+2:]
                # what follows the closing **
                m = re.match(r'(\s*([（(][^）)]*[）)])\s*）?\s*）?)*\s*([：:])', rest)
                if not m:
                    m2 = re.match(r'\s*([：:])', rest)
                if m2:
                    res.append('**' + content + '**' + m2.group(0))
                    pos = a + 2 + len(content) + 2 + len(m2.group(0))
                else:
                    res.append(content)
                    pos = b + 2
        new_line = process_segment(line)
        out.append(new_line)
    return ''.join(out)
