# _pages/*.html と _head.txt から、公開用の HTML を作る（python3 build.py）
import re, pathlib, time
V = time.strftime("%Y%m%d%H%M")
root = pathlib.Path(__file__).parent
head = (root / "_head.txt").read_text()
for src in sorted((root / "_pages").glob("*.html")):
    t = src.read_text()
    m = re.match(r"<!--meta\n(.*?)\n-->\n", t, re.S)
    meta = dict(l.split(": ", 1) for l in m.group(1).splitlines())
    body = t[m.end():]
    html = head.replace("__TITLE__", meta["title"]).replace("__DESC__", meta["desc"])
    html += f'<body data-page="{meta["page"]}">\n{body}</body>\n</html>\n'
    for a in ("assets/style.css", "assets/site.js", "assets/data.js", "config.js"):
        html = html.replace(f'"{a}"', f'"{a}?v={V}"')
    (root / src.name).write_text(html)
    print("built", src.name)
