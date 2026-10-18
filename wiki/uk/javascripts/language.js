document.addEventListener("click", async event => {
  const link = event.target.closest && event.target.closest("a[hreflang]");
  if (!link || event.metaKey || event.ctrlKey) return;
  const bases = [...document.querySelectorAll("link[rel=alternate][hreflang]")]
    .map(alt => ({ lang: alt.hreflang, base: alt.href.replace(/\/?$/, "/") }))
    .sort((a, b) => b.base.length - a.base.length);
  const here = location.href.split("#")[0];
  const from = bases.find(alt => here.startsWith(alt.base));
  const to = bases.find(alt => alt.lang === link.hreflang);
  if (!from || !to || from === to) return;
  event.preventDefault();
  event.stopPropagation();
  const target = to.base + here.slice(from.base.length);
  try {
    const answer = await fetch(target, { method: "HEAD" });
    location.href = answer.ok ? target : to.base;
  } catch (failure) {
    location.href = to.base;
  }
}, true);
