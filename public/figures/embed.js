/*
 * Framed mode for the isometric figures in /figures/<name>/ (jokuh-live docs/figures builds).
 * Only acts when the page is inside an iframe (FigureEmbed.tsx): drops the standalone page
 * margins so the frame is just the figure, and reports the document height to the parent
 * via postMessage so the frame can size itself. Opened directly ("Open full screen") it does nothing.
 */
(function () {
  if (window.parent === window) return;
  var root = document.documentElement;
  root.setAttribute("data-embed", "");
  var style = document.createElement("style");
  style.textContent =
    "html[data-embed],html[data-embed] body{background:var(--anatomy-card)}" +
    "html[data-embed] .iso-page{width:100%;margin:0}" +
    "html[data-embed] .iso-figure{margin:0}" +
    "html[data-embed] .iso-plate{box-shadow:none}" +
    "html[data-embed] figcaption{padding:0 20px 20px}";
  document.head.appendChild(style);
  var last = 0;
  function report() {
    var h = Math.ceil(document.documentElement.getBoundingClientRect().height);
    if (h && h !== last) {
      last = h;
      window.parent.postMessage({ type: "jokuh-figure:height", height: h }, "*");
    }
  }
  if ("ResizeObserver" in window) new ResizeObserver(report).observe(document.documentElement);
  window.addEventListener("load", report);
  report();
})();
