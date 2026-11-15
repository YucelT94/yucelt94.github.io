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

	// Durations like "7 yrs" / "2 yıl 6 ay", counted inclusively as LinkedIn does.
	// data-from / data-to are "YYYY-MM"; no data-to means "until this month".
	function renderDurations(lang) {
		var now = new Date();
		document.querySelectorAll(".dur[data-from]").forEach(function (el) {
			var f = el.dataset.from.split("-").map(Number);
			var t = el.dataset.to ? el.dataset.to.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
			var total = (t[0] - f[0]) * 12 + (t[1] - f[1]) + 1;
			var y = Math.floor(total / 12), m = total % 12, parts = [];
			if (lang === "tr") {
				if (y) parts.push(y + " yıl");
				if (m) parts.push(m + " ay");
			} else {
				if (y) parts.push(y + (y === 1 ? " yr" : " yrs"));
				if (m) parts.push(m + (m === 1 ? " mo" : " mos"));
			}
			el.textContent = parts.join(" ");
		});
	}

	function setLang(lang) {
		root.lang = lang;
		nodes.forEach(function (el) { el.textContent = el.dataset[lang]; });
		document.title = title[lang];
		renderDurations(lang);
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
