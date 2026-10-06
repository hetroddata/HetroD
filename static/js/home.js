document.addEventListener("DOMContentLoaded", () => {
  const tabList = document.querySelector(".behavior-tabs");
  const tabs = [...document.querySelectorAll(".behavior-tabs button")];
  const panels = [...document.querySelectorAll(".behavior-panel")];

  if (tabList && tabs.length === panels.length && tabs.length) {
    tabList.setAttribute("role", "tablist");
    tabList.hidden = false;
    const selectTab = (selected, focus = false) => {
      tabs.forEach((tab, index) => {
        const active = index === selected;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[index].hidden = !active;
      });
      if (focus) tabs[selected].focus();
    };
    tabs.forEach((tab, index) => {
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panels[index].id);
      panels[index].setAttribute("role", "tabpanel");
      panels[index].setAttribute("aria-labelledby", tab.id);
      panels[index].tabIndex = 0;
      tab.addEventListener("click", () => selectTab(index));
      tab.addEventListener("keydown", event => {
        let next;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); selectTab(next, true); }
      });
    });
    selectTab(0);
  }

  const videos = [...document.querySelectorAll("video")];
  videos.forEach(video => {
    video.addEventListener("play", () => {
      videos.forEach(other => { if (other !== video) other.pause(); });
    });
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && !entry.target.paused) entry.target.pause();
      });
    }, {threshold: 0.05});
    videos.forEach(video => observer.observe(video));
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) videos.forEach(video => video.pause());
  });

  const copyButton = document.querySelector("#copy-bibtex");
  const citation = document.querySelector("#citation-code");
  const status = document.querySelector("#copy-status");
  if (copyButton && citation && status) {
    copyButton.hidden = false;
    copyButton.addEventListener("click", async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(citation.textContent);
        copyButton.textContent = "Copied!";
        status.textContent = "BibTeX copied to clipboard.";
        setTimeout(() => { copyButton.textContent = "Copy BibTeX"; }, 2200);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(citation);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        citation.parentElement.focus();
        status.textContent = "Citation selected. Press Ctrl+C or Command+C to copy.";
      }
    });
  }
});
