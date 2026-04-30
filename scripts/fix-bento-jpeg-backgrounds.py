#!/usr/bin/env python3
"""Replace edge-connected near-black background in mislabeled JPEG-as-PNG bento assets with transparency.

These files are saved as .png but are often RGB JPEGs (no alpha); borders sample as #000000.
We seed flood fill from every pixel on the image perimeter (not only corners) so black attached
along top/bottom edges is removed. Maps/github are real PNG RGBA and are skipped."""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "pods-bento"

# Pixels with max(R,G,B) <= THRESH are treated as background and cleared if connected to the border
THRESH = 28

# Opaque dark pixels touching transparency (anti-alias fringe); cleared in strip_dark_boundary_fringe
FRINGE_MAX_RGB = 70


def is_background(r: int, g: int, b: int) -> bool:
    return max(r, g, b) <= THRESH


def flood_transparent_rgba(im: Image.Image) -> Image.Image:
    if im.mode != "RGBA":
        im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    q: deque[tuple[int, int]] = deque()
    seen: set[tuple[int, int]] = set()

    def try_seed(x: int, y: int) -> None:
        r, g, b, a = px[x, y]
        if a and is_background(r, g, b) and (x, y) not in seen:
            seen.add((x, y))
            q.append((x, y))

    for x in range(w):
        try_seed(x, 0)
        if h > 1:
            try_seed(x, h - 1)
    for y in range(1, h - 1):
        try_seed(0, y)
        if w > 1:
            try_seed(w - 1, y)
    while q:
        x, y = q.popleft()
        r, g, b, a = px[x, y]
        if not a or not is_background(r, g, b):
            continue
        px[x, y] = (0, 0, 0, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                continue
            if (nx, ny) in seen:
                continue
            r2, g2, b2, a2 = px[nx, ny]
            if a2 and is_background(r2, g2, b2):
                seen.add((nx, ny))
                q.append((nx, ny))
    return im


def lighten_dark_halos(im: Image.Image) -> Image.Image:
    """After flood fill, drop semi-transparent pixels that are still dark (premultiplied black AA)."""
    px = im.load()
    w, h = im.size
    halo_max_rgb = 40
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0 or a == 255:
                continue
            if max(r, g, b) <= halo_max_rgb:
                px[x, y] = (0, 0, 0, 0)
    return im


def strip_dark_boundary_fringe(im: Image.Image) -> Image.Image:
    """Remove opaque dark pixels adjacent to alpha=0 (gray/black fringe on content boundary)."""
    px = im.load()
    w, h = im.size
    neigh = ((1, 0), (-1, 0), (0, 1), (0, -1))
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            touches_transparent = False
            for dx, dy in neigh:
                nx, ny = x + dx, y + dy
                if nx < 0 or ny < 0 or nx >= w or ny >= h:
                    continue
                if px[nx, ny][3] == 0:
                    touches_transparent = True
                    break
            if touches_transparent and max(r, g, b) <= FRINGE_MAX_RGB:
                px[x, y] = (0, 0, 0, 0)
    return im


def main() -> None:
    names = [
        "bento-products.png",
        "bento-products-dark.png",
        "bento-podcast.png",
        "bento-art.png",
    ]
    for name in names:
        path = ROOT / name
        if not path.exists():
            print("skip missing", path)
            continue
        im = Image.open(path)
        im = flood_transparent_rgba(im)
        im = lighten_dark_halos(im)
        im = strip_dark_boundary_fringe(im)
        im.save(path, format="PNG", optimize=True)
        print("wrote", path)


if __name__ == "__main__":
    main()
