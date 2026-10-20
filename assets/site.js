// 全ページ共通：ヘッダー・フッター・スマホ下のボタン・翻訳・営業状況・フォーム送信
(function () {
  const C = window.SITE_CONFIG, D = window.SITE_DATA;
  const page = document.body.dataset.page || "";
  const yen = (n) => n.toLocaleString("ja-JP") + "円";
  window.yen = yen;

  const NAV = [
    ["index.html", "トップ", "home"],
    ["spa.html", "お風呂", "spa"],
    ["restaurant.html", "レストラン", "restaurant"],
    ["stay.html", "本館ご宿泊", "stay"],
    ["moving-house.html", "ムービングハウス", "moving"],
    ["party.html", "ご宴会・ご法要", "party"],
    ["access.html", "アクセス", "access"],
    ["contact.html", "お問い合わせ", "contact"],
  ];

  const ICON = {
    tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  };

  // 写真の代わりに置く模様（本番は施設の写真に差し替える）
  const MOTIF = {
    bath: '<svg class="motif" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><path d="M30 40c0-8 8-8 8-16M50 40c0-8 8-8 8-16M70 40c0-8 8-8 8-16"/><path d="M10 55h80v10a20 20 0 0 1-20 20H30a20 20 0 0 1-20-20z"/></svg>',
    food: '<svg class="motif" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><path d="M10 50h80a40 40 0 0 1-80 0z"/><path d="M30 20l25 25M45 15l20 30"/></svg>',
    house: '<svg class="motif" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><path d="M15 50L50 20l35 30v35H15z"/><path d="M40 85V60h20v25"/></svg>',
    stay: '<svg class="motif" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><path d="M10 30v50M10 50h70a10 10 0 0 1 10 10v20M10 70h80"/><circle cx="30" cy="42" r="7"/></svg>',
    welcome: '<svg class="motif" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 80l30-40 20 25 15-15 25 30z"/><circle cx="75" cy="25" r="10"/></svg>',
    party: '<svg class="motif" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><path d="M30 20h40l-5 30a15 15 0 0 1-30 0z"/><path d="M50 65v20M35 85h30"/></svg>',
  };
  window.ph = (kind, note) =>
    `<div class="ph g-${kind}" role="img" aria-label="${note || "写真"}">${MOTIF[kind] || ""}<span class="ph-note">写真：${note || ""}</span></div>`;
  document.querySelectorAll("[data-ph]").forEach((el) => {
    const [kind, note] = el.dataset.ph.split("|");
    el.outerHTML = window.ph(kind, note);
  });

  // ── ヘッダー
  const header = document.createElement("div");
  header.innerHTML = `
    <a class="skip" href="#main">本文へ移動</a>
    <div class="demo-bar">これは Web サイトの<strong>制作サンプル（非公式）</strong>です。正式なサイトは <a href="${C.OFFICIAL_URL}" rel="noopener">kobushi-atsuma.com</a></div>
    <header class="site-header">
      <div class="wrap">
        <a class="logo" href="index.html"><b>${D.name}</b><small>ATSUMA RADON SPA &amp; HOTEL</small></a>
        <nav class="gnav" id="gnav" aria-label="メインメニュー">
          ${NAV.map(([h, t, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
        </nav>
        <a class="header-tel" href="tel:${D.tel}">☎ ${D.tel}</a>
        <button class="lang-btn" id="langBtn" type="button" aria-label="Language">🌐 Language</button>
        <div id="google_translate_element"></div>
        <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="gnav">メニュー</button>
      </div>
    </header>`;
  document.body.prepend(...header.childNodes);

  const menuBtn = document.getElementById("menuBtn");
  menuBtn.addEventListener("click", () => {
    const nav = document.getElementById("gnav");
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.textContent = open ? "閉じる" : "メニュー";
  });

  // ── Google 翻訳（押したときだけ読み込む）
  document.getElementById("langBtn").addEventListener("click", function () {
    this.remove();
    window.googleTranslateElementInit = () => {
      new google.translate.TranslateElement(
        { pageLanguage: "ja", includedLanguages: "en,ko,zh-CN,zh-TW", layout: google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: false },
        "google_translate_element"
      );
    };
    const s = document.createElement("script");
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(s);
  });

  // ── フッター
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <h3>${D.name}</h3>
          <p>〒${D.zip}<br>${D.address}</p>
          <p>TEL <a href="tel:${D.tel}">${D.tel}</a><br>FAX ${D.fax}</p>
          <p>日帰り入浴 10:00〜22:00<br>フロント 〜21:00（以後は警備員が対応）</p>
        </div>
        <div>
          <h3>ご案内</h3>
          <ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}<li><a href="safety.html">安心・安全への取り組み</a></li></ul>
        </div>
        <div>
          <h3>厚真町の関連リンク</h3>
          <ul>${D.links.map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener">${l.name}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h3>SNS・ご予約</h3>
          <ul>
            <li><a href="${C.FACEBOOK_URL}" target="_blank" rel="noopener">Facebook</a></li>
            <li><a href="https://www.youtube.com/watch?v=${C.YOUTUBE_ID}" target="_blank" rel="noopener">YouTube（紹介動画）</a></li>
            <li><a href="${C.BOOKING_URL}" target="_blank" rel="noopener">宿泊のネット予約</a></li>
            <li><a href="${C.BOOKING_CHECK_URL}" target="_blank" rel="noopener">ネット予約の確認・キャンセル</a></li>
          </ul>
        </div>
      </div>
      <p class="copy">© Kobushinoyu Atsuma ／ 制作サンプル（非公式）。掲載の料金・時間は元のサイトの内容です。最新の情報はお電話でご確認ください。</p>
    </div>`;
  document.body.appendChild(footer);

  // ── スマホ下の固定ボタン
  const dock = document.createElement("nav");
  dock.className = "dock";
  dock.setAttribute("aria-label", "すぐに使うボタン");
  dock.innerHTML = `
    <a href="tel:${D.tel}">${ICON.tel}電話</a>
    <a class="main" href="${C.BOOKING_URL}" target="_blank" rel="noopener">${ICON.bed}宿泊予約</a>
    <a href="access.html">${ICON.pin}アクセス</a>`;
  document.body.appendChild(dock);

  // ── 今の営業状況（日本時間で判定）
  const nowJst = () => {
    const d = new Date(Date.now() + (new Date().getTimezoneOffset() + 540) * 60000);
    return d.getHours() * 60 + d.getMinutes();
  };
  const toMin = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
  window.isOpen = (key) => { const h = D.hours[key], n = nowJst(); return n >= toMin(h.open) && n < toMin(h.close); };
  document.querySelectorAll("[data-status]").forEach((el) => {
    const key = el.dataset.status, h = D.hours[key], open = window.isOpen(key);
    el.innerHTML = `<span class="pill ${open ? (key === "butadon" ? "hot" : "open") : "closed"}">${open ? "営業中" : "時間外"}</span> ${h.label} ${h.open}〜${h.close}`;
  });

  // ── スクロールで出てくる演出
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 }) : null;
  document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

  // ── Google 連携：フォーム送信（Apps Script → スプレッドシート＋メール）
  window.sendToGoogle = async (payload) => {
    if (!C.GAS_URL) return { ok: true, demo: true };
    try {
      const res = await fetch(C.GAS_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
      const json = await res.json();
      return json;
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  };

  // ── Google 連携：お知らせ（スプレッドシートの「お知らせ」シートから）
  window.loadNews = async () => {
    if (!C.GAS_URL) return D.sampleNews;
    try {
      const res = await fetch(C.GAS_URL + "?action=news");
      const json = await res.json();
      return json.ok && json.items.length ? json.items : D.sampleNews;
    } catch (e) {
      return D.sampleNews;
    }
  };

  // Google カレンダーに予定を追加するリンク
  window.gcalLink = ({ title, date, start = "17:00", end = "19:00", details = "" }) => {
    const d = date.replace(/-/g, "");
    const t = (s) => s.replace(":", "") + "00";
    const q = new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${d}T${t(start)}/${d}T${t(end)}`, ctz: "Asia/Tokyo", location: `${D.name} ${D.address}`, details });
    return "https://calendar.google.com/calendar/render?" + q.toString();
  };

  // 文字を HTML として安全に出す
  window.esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // フォーム共通：入力チェック → Google へ送信 → 完了表示
  window.bindForm = (form, { extraCheck, done, result }) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      form.querySelectorAll(".field").forEach((f) => f.classList.remove("invalid"));
      const bad = [];
      form.querySelectorAll("input, select, textarea").forEach((el) => {
        if (el.closest("[hidden]")) return;
        if (!el.checkValidity() || (el.required && !String(el.value).trim())) bad.push(el);
      });
      (extraCheck ? extraCheck(form) : []).forEach((name) => bad.push(form[name]));
      if (bad.length) {
        bad.forEach((el) => el.closest(".field")?.classList.add("invalid"));
        bad[0].focus();
        return;
      }
      const btn = form.querySelector("button[type=submit]");
      const label = btn.textContent;
      btn.disabled = true; btn.textContent = "送信中…";
      const data = Object.fromEntries(new FormData(form).entries());
      data.page = location.pathname; data.sentAt = new Date().toISOString();
      const res = await window.sendToGoogle(data);
      btn.disabled = false; btn.textContent = label;
      if (!res.ok) {
        alert("送信できませんでした。お手数ですがお電話（" + D.tel + "）でお問い合わせください。");
        return;
      }
      done(data, res);
      form.hidden = true;
      result.classList.add("show");
      result.focus();
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // 日付の計算（日本時間の今日から n 日後、YYYY-MM-DD）
  window.dateAfter = (n) => {
    const d = new Date(Date.now() + 9 * 3600000 + n * 86400000);
    return d.toISOString().slice(0, 10);
  };
})();
