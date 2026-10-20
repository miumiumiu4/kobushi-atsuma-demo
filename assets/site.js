// 全ページ共通：ヘッダー・全画面メニュー・フッター・スマホ下のナビ・翻訳・営業状況・フォーム送信
(function () {
  const C = window.SITE_CONFIG, D = window.SITE_DATA;
  const page = document.body.dataset.page || "";
  const yen = (n) => Number(n).toLocaleString("ja-JP") + "円";
  window.yen = yen;

  const NAV = [
    ["index.html", "トップ", "Top", "home"],
    ["reserve.html", "ご予約", "Reservation", "reserve"],
    ["spa.html", "お風呂", "Hot Spring", "spa"],
    ["restaurant.html", "お食事", "Restaurant", "restaurant"],
    ["stay.html", "本館ご宿泊", "Rooms", "stay"],
    ["moving-house.html", "ムービングハウス", "Cabins", "moving"],
    ["party.html", "ご宴会・ご法要", "Banquet", "party"],
    ["access.html", "アクセス", "Access", "access"],
    ["contact.html", "お問い合わせ", "Contact", "contact"],
  ];
  const HEAD_NAV = NAV.filter(([, , , k]) => !["home", "reserve"].includes(k));

  const I = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICON = {
    home: I('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
    spa: I('<path d="M8 4c0 2-2 2-2 4s2 2 2 4M12 4c0 2-2 2-2 4s2 2 2 4M16 4c0 2-2 2-2 4s2 2 2 4"/><path d="M3 15h18v1a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/>'),
    cal: I('<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    food: I('<path d="M4 12h16a8 8 0 0 1-16 0zM9 4l3 6M14 3l2 7"/>'),
    tel: I('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
  };

  // 写真の代わりに置く模様（本番は施設の写真に差し替える）
  const MOTIF = {
    bath: '<svg class="motif" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M30 40c0-8 8-8 8-16M50 40c0-8 8-8 8-16M70 40c0-8 8-8 8-16"/><path d="M10 55h80v10a20 20 0 0 1-20 20H30a20 20 0 0 1-20-20z"/></svg>',
    food: '<svg class="motif" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 50h80a40 40 0 0 1-80 0z"/><path d="M30 20l25 25M45 15l20 30"/></svg>',
    house: '<svg class="motif" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 50L50 20l35 30v35H15z"/><path d="M40 85V60h20v25"/></svg>',
    stay: '<svg class="motif" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 30v50M10 50h70a10 10 0 0 1 10 10v20M10 70h80"/><circle cx="30" cy="42" r="7"/></svg>',
    welcome: '<svg class="motif" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 80l30-40 20 25 15-15 25 30z"/><circle cx="75" cy="25" r="10"/></svg>',
    party: '<svg class="motif" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M30 20h40l-5 30a15 15 0 0 1-30 0z"/><path d="M50 65v20M35 85h30"/></svg>',
  };
  window.ph = (kind, note, cls = "") =>
    `<div class="ph g-${kind} ${cls}" role="img" aria-label="${note || "写真"}">${MOTIF[kind] || ""}<span class="ph-note">Photo — ${note || ""}</span></div>`;
  document.querySelectorAll("[data-ph]").forEach((el) => {
    const [kind, note] = el.dataset.ph.split("|");
    const tmp = document.createElement("div");
    tmp.innerHTML = window.ph(kind, note, el.className);
    const node = tmp.firstElementChild;
    if (el.getAttribute("style")) node.setAttribute("style", el.getAttribute("style"));
    el.replaceWith(node);
  });

  // ── ヘッダー
  const header = document.createElement("div");
  header.innerHTML = `
    <a class="skip" href="#main">本文へ移動</a>
    <div class="demo-bar">Web サイトの<strong>制作サンプル（非公式）</strong>です。正式なサイトは <a href="${C.OFFICIAL_URL}" rel="noopener">kobushi-atsuma.com</a></div>
    <header class="site-header">
      <div class="wrap">
        <a class="logo" href="index.html"><b>こぶしの湯あつま</b><small>KOBUSHI NO YU ATSUMA</small></a>
        <nav class="gnav" aria-label="メインメニュー">
          ${HEAD_NAV.map(([h, t, , k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
        </nav>
        <div class="head-actions">
          <button class="lang-btn" id="langBtn" type="button">EN / 中 / 한</button>
          <div id="google_translate_element"></div>
          <a class="head-book" href="reserve.html"><span class="long">空室検索・</span>予約</a>
          <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="drawer">MENU</button>
        </div>
      </div>
    </header>
    <div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="メニュー">
      <div class="wrap">
        <div class="drawer-top">
          <a class="logo" href="index.html"><b>こぶしの湯あつま</b><small>KOBUSHI NO YU ATSUMA</small></a>
          <button class="menu-btn" id="closeBtn" type="button" style="display:inline-block">CLOSE ✕</button>
        </div>
        <nav>${NAV.map(([h, t, en]) => `<a href="${h}">${t}<span>${en}</span></a>`).join("")}<a href="safety.html">安心・安全への取り組み<span>Safety</span></a></nav>
        <div class="drawer-foot">
          <a class="btn btn-primary btn-wide" href="reserve.html">空室検索・ご予約</a>
          <a class="btn btn-wide" href="tel:${D.tel}">お電話 ${D.tel}</a>
          <p class="muted">〒${D.zip} ${D.address}<br>日帰り入浴 10:00〜22:00 ／ フロント 〜21:00</p>
        </div>
      </div>
    </div>`;
  document.body.prepend(...header.childNodes);

  const drawer = document.getElementById("drawer"), menuBtn = document.getElementById("menuBtn");
  const setDrawer = (open) => {
    drawer.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) document.getElementById("closeBtn").focus(); else menuBtn.focus();
  };
  menuBtn.addEventListener("click", () => setDrawer(true));
  document.getElementById("closeBtn").addEventListener("click", () => setDrawer(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("open")) setDrawer(false); });

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

  // ── どのページからでも予約へ（予約・宴会・問い合わせのページ以外）
  if (!["reserve", "party", "contact", "home"].includes(page)) {
    const band = document.createElement("section");
    band.className = "section tight";
    band.innerHTML = `<div class="wrap"><div class="cta-band">
      <div><p class="eyebrow">Reservation</p><h2>日程と人数で、空室検索</h2><p>選べるお部屋・料金・予約の方法が、ひと目でわかります。</p></div>
      <div class="btn-row"><a class="btn btn-primary" href="reserve.html">空室を検索</a><a class="btn" href="tel:${D.tel}">電話 ${D.tel}</a></div>
    </div></div>`;
    document.querySelector("main").appendChild(band);
  }

  // ── フッター
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <div class="f-logo">こぶしの湯あつま</div>
          <p>〒${D.zip}<br>${D.address}</p>
          <p>TEL <a href="tel:${D.tel}">${D.tel}</a> ／ FAX ${D.fax}<br>日帰り入浴 10:00〜22:00<br>フロント 〜21:00（以後は警備員が対応）</p>
        </div>
        <div>
          <h3>Guide</h3>
          <ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}<li><a href="safety.html">安心・安全への取り組み</a></li></ul>
        </div>
        <div>
          <h3>Atsuma</h3>
          <ul>${D.links.map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener">${l.name}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h3>Reservation &amp; SNS</h3>
          <ul>
            <li><a href="reserve.html">空室検索・ご予約</a></li>
            <li><a href="${C.BOOKING_URL}" target="_blank" rel="noopener">宿泊のネット予約（外部）</a></li>
            <li><a href="${C.BOOKING_CHECK_URL}" target="_blank" rel="noopener">ネット予約の確認・キャンセル</a></li>
            <li><a href="${C.FACEBOOK_URL}" target="_blank" rel="noopener">Facebook</a></li>
            <li><a href="https://www.youtube.com/watch?v=${C.YOUTUBE_ID}" target="_blank" rel="noopener">YouTube（紹介動画）</a></li>
          </ul>
        </div>
      </div>
      <p class="copy">© Kobushinoyu Atsuma ／ 制作サンプル（非公式）。料金・時間は元のサイトの内容です。最新の情報はお電話でご確認ください。</p>
    </div>`;
  document.body.appendChild(footer);

  // ── スマホ下の固定ナビ
  const dock = document.createElement("nav");
  dock.className = "dock";
  dock.setAttribute("aria-label", "よく使うページ");
  const di = (h, k, icon, t, cls = "") => `<a class="${cls}" href="${h}"${k === page ? ' aria-current="page"' : ""}>${icon}${t}</a>`;
  dock.innerHTML =
    di("index.html", "home", ICON.home, "ホーム") +
    di("spa.html", "spa", ICON.spa, "お風呂") +
    di("reserve.html", "reserve", ICON.cal, "空室検索", "main") +
    di("restaurant.html", "restaurant", ICON.food, "お食事") +
    `<a href="tel:${D.tel}">${ICON.tel}電話</a>`;
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
    el.innerHTML = `<span class="pill ${open ? (key === "butadon" ? "hot" : "open") : "closed"}">${open ? "営業中" : "時間外"}</span>${h.label} ${h.open}〜${h.close}`;
  });

  // ── スクロールで出てくる演出
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1 }) : null;
  window.observeReveal = (root = document) => root.querySelectorAll(".reveal:not(.in)").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
  window.observeReveal();

  // ── Google 連携：フォーム送信（Apps Script → スプレッドシート＋メール）
  window.sendToGoogle = async (payload) => {
    if (!C.GAS_URL) return { ok: true, demo: true };
    try {
      const res = await fetch(C.GAS_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
      return await res.json();
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

  // Google カレンダーに予定を追加するリンク（終日なら start を省く）
  window.gcalLink = ({ title, date, endDate, start, end, details = "" }) => {
    const d = (s) => s.replace(/-/g, "");
    const t = (s) => s.replace(":", "") + "00";
    const dates = start ? `${d(date)}T${t(start)}/${d(date)}T${t(end)}` : `${d(date)}/${d(endDate || date)}`;
    const q = new URLSearchParams({ action: "TEMPLATE", text: title, dates, ctz: "Asia/Tokyo", location: `${D.name} ${D.address}`, details });
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

  // 日付（日本時間の今日から n 日後、YYYY-MM-DD）
  window.dateAfter = (n) => new Date(Date.now() + 9 * 3600000 + n * 86400000).toISOString().slice(0, 10);
  // 「10月25日(土)」の形
  window.jpDate = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    const w = "日月火水木金土"[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
    return `${m}月${d}日(${w})`;
  };
  window.nightsBetween = (a, b) => Math.round((Date.UTC(...b.split("-").map((v, i) => (i === 1 ? v - 1 : +v))) - Date.UTC(...a.split("-").map((v, i) => (i === 1 ? v - 1 : +v)))) / 86400000);
})();
