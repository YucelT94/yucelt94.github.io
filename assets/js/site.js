// yucelt.dev — language (TR/EN) and theme (light/dark) toggles.
// English is the markup text; elements with data-tr carry the Turkish version.
(function () {
	var root = document.documentElement;

	function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
	function save(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

	// Language
	var nodes = document.querySelectorAll("[data-tr]");
	nodes.forEach(function (el) { el.dataset.en = el.textContent; });
	var title = { en: document.title, tr: root.dataset.titleTr || document.title };
	var meta = document.querySelector('meta[name="description"]');
	var desc = meta && { en: meta.content, tr: meta.dataset.tr || meta.content };

	function setLang(lang) {
		root.lang = lang;
		nodes.forEach(function (el) { el.textContent = el.dataset[lang]; });
		document.title = title[lang];
		if (desc) meta.content = desc[lang];
		document.querySelectorAll("[data-lang-opt]").forEach(function (el) {
			el.classList.toggle("off", el.dataset.langOpt !== lang);
		});
		var btn = document.getElementById("lang-toggle");
		if (btn) btn.setAttribute("aria-label", lang === "tr" ? "Switch to English" : "Türkçe'ye geç");
	}

	var lang = load("lang") || ((navigator.language || "").toLowerCase().indexOf("tr") === 0 ? "tr" : "en");
	setLang(lang);

	var langBtn = document.getElementById("lang-toggle");
	if (langBtn) langBtn.addEventListener("click", function () {
		lang = lang === "tr" ? "en" : "tr";
		save("lang", lang);
		setLang(lang);
	});

	// Theme: follows the system until the visitor picks one.
	var media = window.matchMedia("(prefers-color-scheme: dark)");
	function currentTheme() { return root.dataset.theme || (media.matches ? "dark" : "light"); }
	function syncThemeBtn() {
		var btn = document.getElementById("theme-toggle");
		if (!btn) return;
		var dark = currentTheme() === "dark";
		btn.querySelector(".sun").style.display = dark ? "" : "none";
		btn.querySelector(".moon").style.display = dark ? "none" : "";
		btn.setAttribute("aria-label", dark ? "Light theme" : "Dark theme");
	}
	syncThemeBtn();
	if (media.addEventListener) media.addEventListener("change", syncThemeBtn);

	var themeBtn = document.getElementById("theme-toggle");
	if (themeBtn) themeBtn.addEventListener("click", function () {
		var next = currentTheme() === "dark" ? "light" : "dark";
		root.dataset.theme = next;
		save("theme", next);
		syncThemeBtn();
	});
})();
