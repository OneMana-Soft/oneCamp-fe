#!/usr/bin/env python3
"""
Quick LOC counter (approximate).

- Excludes typical build/artifact dirs (node_modules, .next, dist, vendor, etc.)
- Counts lines in text-like files by decoding as UTF-8 with errors ignored.
"""

from __future__ import annotations

import os
import sys
from collections import defaultdict
from pathlib import Path


DEFAULT_EXCLUDE_DIRS = {
    ".git",
    "node_modules",
    ".next",
    "dist",
    "build",
    "out",
    ".turbo",
    ".cache",
    "coverage",
    "vendor",
}

DEFAULT_EXCLUDE_EXT = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".ico",
    ".svg",
    ".map",
    ".lock",
    ".pyc",
}


def is_excluded_dir(name: str, exclude_dirs: set[str]) -> bool:
    return name in exclude_dirs or name.startswith(".")


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    exclude_dirs = set(DEFAULT_EXCLUDE_DIRS)
    exclude_ext = set(DEFAULT_EXCLUDE_EXT)

    files = 0
    lines = 0
    byext: dict[str, int] = defaultdict(int)

    for current_root, dirs, fs in os.walk(root):
        # prune dirs in-place
        dirs[:] = [d for d in dirs if not is_excluded_dir(d, exclude_dirs)]
        for f in fs:
            if f.startswith("."):
                continue
            ext = Path(f).suffix.lower()
            if ext in exclude_ext:
                continue
            p = Path(current_root) / f
            try:
                data = p.read_bytes()
            except Exception:
                continue
            try:
                txt = data.decode("utf-8", errors="ignore")
            except Exception:
                continue
            n = txt.count("\n") + (1 if txt and not txt.endswith("\n") else 0)
            files += 1
            lines += n
            byext[ext or "[noext]"] += n

    print(str(root))
    print(f"files {files}")
    print(f"lines {lines}")
    for ext, n in sorted(byext.items(), key=lambda x: -x[1])[:15]:
        print(f"{ext} {n}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
