/* Draws the Jokuh goo cluster (Identity hub + Messages, Calls, Spine, Docs, OO) into <svg id="cluster">. */
(function () {
  const W = 800, H = 440;
  const hub = { id: "Identity", x: 400, y: 220, r: 72, c: "#9327ff" };
  const beads = [
    { id: "Messages", x: 210, y: 96, r: 46, c: "#ff0700" },
    { id: "Calls", x: 120, y: 280, r: 44, c: "#21dc11" },
    { id: "Spine", x: 640, y: 100, r: 46, c: "#ffb800" },
    { id: "Docs", x: 706, y: 286, r: 42, c: "#ff4d00" },
    { id: "OO", x: 420, y: 384, r: 48, c: "#8c73ff" },
  ];
  const svg = document.getElementById("cluster");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const ns = "http://www.w3.org/2000/svg";
  svg.innerHTML = `<defs><filter id="g" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b"/><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"/></filter></defs>`;
  const g = document.createElementNS(ns, "g"); g.setAttribute("filter", "url(#g)"); svg.appendChild(g);
  for (const b of beads) { const l = document.createElementNS(ns, "line"); Object.entries({ x1: hub.x, y1: hub.y, x2: b.x, y2: b.y, stroke: b.c, "stroke-width": 26, "stroke-linecap": "round" }).forEach(([k, v]) => l.setAttribute(k, v)); g.appendChild(l); }
  for (const b of [hub, ...beads]) { const c = document.createElementNS(ns, "circle"); Object.entries({ cx: b.x, cy: b.y, r: b.r, fill: b.c }).forEach(([k, v]) => c.setAttribute(k, v)); g.appendChild(c); }
  for (const b of [hub, ...beads]) {
    const t = document.createElementNS(ns, "text"); t.textContent = b.id;
    Object.entries({ x: b.x, y: b.y + 5, "text-anchor": "middle", fill: "#fff", "font-weight": 700, "font-size": 17, "font-family": "Satoshi" }).forEach(([k, v]) => t.setAttribute(k, v)); svg.appendChild(t);
  }
})();
