// 空室検索（予約ウィジェット）とカレンダー
(function () {
  const D = window.SITE_DATA;
  const DOW = ["月", "火", "水", "木", "金", "土", "日"];
  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
  const addDays = (s, n) => { const [y, m, d] = s.split("-").map(Number); const t = new Date(Date.UTC(y, m - 1, d + n)); return t.toISOString().slice(0, 10); };

  // ── カレンダー（範囲 or 1 日）
  const sheet = document.createElement("div");
  sheet.className = "cal-sheet";
  sheet.innerHTML = `
    <div class="backdrop"></div>
    <div class="cal-box" role="dialog" aria-modal="true" aria-labelledby="calTitle">
      <div class="cal-head"><b id="calTitle">日程を選ぶ</b><button class="cal-close" type="button" aria-label="閉じる">×</button></div>
      <div class="cal-nav"><button type="button" data-step="-1" aria-label="前の月">‹</button><button type="button" data-step="1" aria-label="次の月">›</button></div>
      <div class="cal-months"></div>
      <div class="cal-foot"><span class="sel" aria-live="polite"></span><div class="btn-row"><button class="btn" type="button" data-clear>クリア</button><button class="btn btn-primary" type="button" data-ok>決定</button></div></div>
    </div>`;
  document.body.appendChild(sheet);
  const months = sheet.querySelector(".cal-months"), selText = sheet.querySelector(".sel"), okBtn = sheet.querySelector("[data-ok]");
  let st = {};

  function render() {
    const narrow = matchMedia("(max-width: 640px)").matches;
    const count = narrow ? 6 : 2;
    const [y0, m0] = st.min.split("-").map(Number);
    let html = "";
    for (let i = 0; i < count; i++) {
      const base = new Date(Date.UTC(y0, m0 - 1 + st.offset + i, 1));
      const y = base.getUTCFullYear(), m = base.getUTCMonth() + 1;
      const first = (base.getUTCDay() + 6) % 7, days = new Date(Date.UTC(y, m, 0)).getUTCDate();
      html += `<div class="cal-month"><h4>${y}年${m}月</h4><div class="cal-grid">${DOW.map((w, j) => `<span class="dow ${j === 5 ? "sat" : j === 6 ? "sun" : ""}">${w}</span>`).join("")}`;
      html += "<span></span>".repeat(first);
      for (let d = 1; d <= days; d++) {
        const s = ymd(y, m, d), wd = (first + d - 1) % 7;
        const dis = s < st.min || s > st.max || (st.mode === "range" && st.start && !st.end && s <= st.start && s !== st.start);
        const cls = [wd === 5 ? "sat" : wd === 6 ? "sun" : "", s === st.today ? "today" : "", s === st.start ? "start" : "", s === st.end ? "end" : "", st.start && st.end && s > st.start && s < st.end ? "in-range" : ""].join(" ");
        html += `<button type="button" class="${cls}" data-d="${s}" ${dis ? "disabled" : ""} aria-label="${window.jpDate(s)}${s === st.start ? " 選択中" : ""}">${d}</button>`;
      }
      html += "</div></div>";
    }
    months.innerHTML = html;
    sheet.querySelector('[data-step="-1"]').disabled = st.offset <= 0;
    sheet.querySelector('[data-step="1"]').disabled = st.offset >= 10;
    if (st.mode === "range") {
      selText.textContent = st.start && st.end ? `${window.jpDate(st.start)} 〜 ${window.jpDate(st.end)}（${window.nightsBetween(st.start, st.end)}泊）` : st.start ? `${window.jpDate(st.start)} チェックイン → チェックアウト日を選んでください` : "チェックイン日を選んでください";
      okBtn.disabled = !(st.start && st.end);
    } else {
      selText.textContent = st.start ? window.jpDate(st.start) : "日付を選んでください";
      okBtn.disabled = !st.start;
    }
  }
  months.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-d]"); if (!b) return;
    const s = b.dataset.d;
    if (st.mode === "single") st.start = s;
    else if (!st.start || st.end || s <= st.start) { st.start = s; st.end = null; }
    else if (window.nightsBetween(st.start, s) > 14) { st.end = addDays(st.start, 14); }
    else st.end = s;
    render();
    const again = months.querySelector(`[data-d="${s}"]`); if (again) again.focus();
  });
  sheet.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => { st.offset += +b.dataset.step; render(); }));
  const close = () => { sheet.classList.remove("open"); document.body.style.overflow = ""; st.returnTo?.focus(); };
  sheet.querySelector(".cal-close").addEventListener("click", close);
  sheet.querySelector(".backdrop").addEventListener("click", close);
  sheet.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  sheet.querySelector("[data-clear]").addEventListener("click", () => { st.start = st.end = null; render(); });
  okBtn.addEventListener("click", () => { st.onDone(st.start, st.end); close(); });

  window.openCalendar = ({ mode = "range", min, start, end, title, onDone, returnTo }) => {
    const today = window.dateAfter(0);
    st = { mode, min: min || today, max: window.dateAfter(365), start, end, today, offset: 0, onDone, returnTo };
    if (start) { const [a, b] = st.min.split("-").map(Number), [c, d] = start.split("-").map(Number); st.offset = Math.max(0, (c - a) * 12 + (d - b)); }
    sheet.querySelector("#calTitle").textContent = title || (mode === "range" ? "宿泊日程を選ぶ" : "日付を選ぶ");
    sheet.classList.add("open");
    document.body.style.overflow = "hidden";
    render();
    sheet.querySelector(".cal-close").focus();
  };

  // ── 予約ウィジェット
  const ROOMS = [
    ["all", "すべてのお部屋"],
    ["main", "本館（和室・洋室）"],
    ["moving", "ムービングハウス"],
    ["camp", "合宿（研修室）"],
  ];
  const stepper = (name, val, min, max, unit) => `
    <span class="stepper" data-stepper="${name}" data-min="${min}" data-max="${max}" data-unit="${unit}">
      <button type="button" data-d="-1" aria-label="減らす">−</button><output aria-live="polite">${val}${unit}</output><button type="button" data-d="1" aria-label="増やす">＋</button>
    </span>`;

  window.mountBooking = (el, init = {}) => {
    const q = new URLSearchParams(location.search);
    const s = {
      tab: init.tab || q.get("tab") || "stay",
      room: q.get("room") || init.room || "all",
      cin: q.get("in") || init.cin || window.dateAfter(1),
      cout: q.get("out") || init.cout || null,
      people: +(q.get("people") || init.people || 2),
      pDate: null, pPeople: 10, course: "",
    };
    if (!s.cout || s.cout <= s.cin) s.cout = addDays(s.cin, 1);

    el.innerHTML = `
      <div class="booking-card">
        <div class="bk-tabs" role="tablist" aria-label="ご予約の種類">
          <button type="button" role="tab" data-tab="stay">ご宿泊</button>
          <button type="button" role="tab" data-tab="party">ご宴会・ご法要</button>
          <button type="button" role="tab" data-tab="day">日帰り入浴・お食事</button>
        </div>
        <div class="bk-panel" data-panel="stay" role="tabpanel">
          <div class="bk-row">
            <label class="bk-field"><small>Room</small><select data-room aria-label="お部屋">${ROOMS.map(([v, t]) => `<option value="${v}">${t}</option>`).join("")}</select></label>
            <button type="button" class="bk-field dates" data-dates><small>Check-in — Check-out</small><b data-dates-text></b></button>
            <div class="bk-field people"><small>Guests</small>${stepper("people", s.people, 1, 39, "名")}</div>
            <button type="button" class="bk-go" data-search>空室を検索</button>
          </div>
          <div class="bk-note"><span><b>日程と人数を選ぶだけ</b>で、選べるお部屋と料金がわかります</span><span>チェックイン 15:00 ／ チェックアウト 10:00</span><span>全室禁煙</span></div>
        </div>
        <div class="bk-panel" data-panel="party" role="tabpanel" hidden>
          <div class="bk-row">
            <button type="button" class="bk-field dates" data-pdate><small>Date</small><b data-pdate-text>ご希望日を選ぶ</b></button>
            <label class="bk-field"><small>Course</small><select data-course aria-label="コース"><option value="">コースを選ぶ</option>${D.courses.map((c) => `<option value="${c.name}">${c.name} ${c.price.toLocaleString()}円</option>`).join("")}<option value="相談したい">相談したい</option></select></label>
            <div class="bk-field people"><small>Guests</small>${stepper("pPeople", 10, 1, 200, "名")}</div>
            <button type="button" class="bk-go" data-party>申し込みへ</button>
          </div>
          <div class="bk-note"><span><b>7 日前まで</b>のご予約（祝皿の名入れは 2 週間前まで）</span><span>お席は 2 時間</span><span>町内送迎 28 名様まで無料</span></div>
        </div>
        <div class="bk-panel" data-panel="day" role="tabpanel" hidden>
          <div class="bk-day">
            <div><small class="muted">日帰り入浴</small><b>予約は不要です</b><span data-status="bath"></span></div>
            <div><small class="muted">入浴料金</small><b>大人 530円</b><span class="muted">小学生 270円 ／ 回数券あり</span></div>
            <div><small class="muted">レストランこぶし</small><b>お食事だけも歓迎</b><span data-status="butadon"></span></div>
          </div>
          <div class="btn-row" style="margin-top:16px"><a class="btn" href="spa.html">お風呂のご案内</a><a class="btn" href="restaurant.html">メニューを見る</a></div>
        </div>
      </div>`;

    const $ = (sel) => el.querySelector(sel);
    const setTab = (t) => {
      s.tab = t;
      el.querySelectorAll("[data-tab]").forEach((b) => b.setAttribute("aria-selected", b.dataset.tab === t));
      el.querySelectorAll("[data-panel]").forEach((p) => (p.hidden = p.dataset.panel !== t));
    };
    el.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => setTab(b.dataset.tab)));
    setTab(s.tab);

    // 営業状況（タブの中）
    el.querySelectorAll("[data-status]").forEach((x) => {
      const k = x.dataset.status, h = D.hours[k], open = window.isOpen(k);
      x.innerHTML = `<span class="pill ${open ? "open" : "closed"}">${open ? "いま営業中" : "時間外"}</span>${h.open}〜${h.close}`;
    });

    const room = $("[data-room]");
    room.value = s.room;
    const maxPeople = () => (s.room === "camp" ? 39 : s.room === "moving" ? 4 : s.room === "main" ? 4 : 39);
    const drawDates = () => { $("[data-dates-text]").textContent = `${window.jpDate(s.cin)} 〜 ${window.jpDate(s.cout)}（${window.nightsBetween(s.cin, s.cout)}泊）`; };
    drawDates();

    // 人数の ＋−
    el.querySelectorAll("[data-stepper]").forEach((box) => {
      const key = box.dataset.stepper, unit = box.dataset.unit, out = box.querySelector("output");
      const lim = () => [ +box.dataset.min, key === "people" ? maxPeople() : +box.dataset.max ];
      const draw = () => {
        const [mn, mx] = lim();
        s[key] = Math.min(Math.max(s[key], mn), mx);
        out.textContent = s[key] + unit;
        box.querySelector('[data-d="-1"]').disabled = s[key] <= mn;
        box.querySelector('[data-d="1"]').disabled = s[key] >= mx;
      };
      box.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { s[key] += +b.dataset.d; draw(); }));
      box._draw = draw; draw();
    });
    room.addEventListener("change", () => { s.room = room.value; el.querySelector('[data-stepper="people"]')._draw(); });

    $("[data-dates]").addEventListener("click", (e) => window.openCalendar({
      mode: "range", start: s.cin, end: s.cout, returnTo: e.currentTarget,
      onDone: (a, b) => { s.cin = a; s.cout = b; drawDates(); },
    }));
    $("[data-search]").addEventListener("click", () => {
      const p = new URLSearchParams({ room: s.room, in: s.cin, out: s.cout, people: s.people });
      if (init.onSearch) init.onSearch(s); else location.href = "reserve.html?" + p.toString() + "#results";
    });

    // 宴会
    const pMin = () => window.dateAfter(7);
    $("[data-pdate]").addEventListener("click", (e) => window.openCalendar({
      mode: "single", min: pMin(), start: s.pDate, title: "ご宴会の日付を選ぶ（7 日後から）", returnTo: e.currentTarget,
      onDone: (a) => { s.pDate = a; $("[data-pdate-text]").textContent = window.jpDate(a); },
    }));
    $("[data-course]").addEventListener("change", (e) => (s.course = e.target.value));
    $("[data-party]").addEventListener("click", () => {
      const p = new URLSearchParams({ people: s.pPeople });
      if (s.pDate) p.set("date", s.pDate);
      if (s.course) p.set("course", s.course);
      location.href = "party.html?" + p.toString() + "#request";
    });

    return s;
  };
})();
