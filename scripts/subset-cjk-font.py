#!/usr/bin/env python
"""
重新子集化中文字体（京華老宋体）并输出 WOFF2。

为什么需要：完整字库 ~35MB，加载要数秒。本脚本扫描站点实际用到的字符，
只保留这些字 + 常用标点/拉丁区段，子集化后约 2MB，加载快十几倍。

何时运行：新增/修改文章后，若出现了原子集里没有的汉字（表现为该字回退到
系统字体、与周围不一致），重跑本脚本即可。

依赖：pip install fonttools brotli
原始字体：fonts-src/KingHwa_OldSong.ttf（不纳入仓库，本地保留）

用法：python scripts/subset-cjk-font.py
"""
import glob
import os
import subprocess
import sys

SRC = "fonts-src/KingHwa_OldSong.ttf"
OUT = "public/fonts/KingHwa_OldSong.woff2"
# 始终保留的区段：ASCII、Latin-1、通用标点、CJK 标点、全角字符、常见破折号/省略号
UNICODES = "U+0020-007E,U+00A0-00FF,U+2000-206F,U+3000-303F,U+FF00-FFEF,U+2018-201F,U+2026,U+2014,U+2013"
SCAN = ["src/content/**/*.md", "src/pages/**/*.astro",
        "src/components/**/*.astro", "src/layouts/**/*.astro", "src/styles/*.css"]


def main():
    if not os.path.exists(SRC):
        sys.exit(f"找不到原始字体 {SRC}，请把京華老宋体 TTF 放到该位置。")
    chars = set()
    for pat in SCAN:
        for f in glob.glob(pat, recursive=True):
            try:
                chars |= set(open(f, encoding="utf-8").read())
            except Exception:
                pass
    with open("used-chars.txt", "w", encoding="utf-8") as fh:
        fh.write("".join(sorted(chars)))
    print(f"扫描到 {len(chars)} 个唯一字符，开始子集化…")
    subprocess.run([
        sys.executable, "-m", "fontTools.subset", SRC,
        "--text-file=used-chars.txt",
        f"--unicodes={UNICODES}",
        "--flavor=woff2",
        f"--output-file={OUT}",
    ], check=True)
    os.remove("used-chars.txt")
    print(f"完成：{OUT}  ({os.path.getsize(OUT)//1024} KB)")


if __name__ == "__main__":
    main()
