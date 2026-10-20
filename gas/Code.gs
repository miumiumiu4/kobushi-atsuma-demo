/**
 * こぶしの湯あつま（制作サンプル）— Google 連携
 *
 * できること
 *  1. サイトのフォーム（お問い合わせ・空室・合宿・宴会）を、このスプレッドシートに 1 行ずつ記録
 *  2. 施設のメールに「新しい申し込み」を通知
 *  3. お客さまがメールを書いていれば、受付の控えを自動返信
 *  4. 「お知らせ」シートの内容を、サイトのトップに表示（doGet?action=news）
 *
 * 置き方は gas/README.md を見てください。
 */

const NOTIFY_TO = ""; // 通知を受けるメール（空なら、このスクリプトの持ち主のメール）
const FACILITY = "こぶしの湯あつま";
const TEL = "0145-26-7126";

const SHEETS = {
  inbox: { name: "受付", head: ["受付番号", "受付日時", "種類", "お名前", "電話", "メール", "日付", "時刻", "泊数", "人数", "コース", "用途", "送迎", "名入れ", "内容・ご要望", "状態", "担当メモ"] },
  news: { name: "お知らせ", head: ["日付", "種類", "タイトル", "リンク(任意)", "表示(○で表示)"] },
};
const TYPE_LABEL = { general: "一般", stay: "本館の空室", moving: "ムービングハウス", camp: "合宿", party: "宴会・法要" };

function setup() {
  const ss = SpreadsheetApp.getActive();
  Object.values(SHEETS).forEach((s) => {
    let sh = ss.getSheetByName(s.name);
    if (!sh) sh = ss.insertSheet(s.name);
    if (sh.getLastRow() === 0) {
      sh.appendRow(s.head);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, s.head.length).setFontWeight("bold").setBackground("#1e3a5f").setFontColor("#ffffff");
    }
  });
  const news = ss.getSheetByName(SHEETS.news.name);
  if (news.getLastRow() === 1) {
    news.appendRow([new Date(), "お知らせ", "Webサイトをリニューアルしました", "", "○"]);
  }
  // 「状態」列の選択肢
  const inbox = ss.getSheetByName(SHEETS.inbox.name);
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(["未対応", "連絡済", "確定", "お断り"], true).build();
  inbox.getRange(2, 16, 1000, 1).setDataValidation(rule);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse(e.postData.contents || "{}");
    const err = check_(d);
    if (err) return json_({ ok: false, error: err });

    const sh = SpreadsheetApp.getActive().getSheetByName(SHEETS.inbox.name);
    const id = "K" + Utilities.formatDate(new Date(), "Asia/Tokyo", "yyMMdd") + "-" + String(sh.getLastRow()).padStart(4, "0");
    const row = [
      id, new Date(), TYPE_LABEL[d.type] || d.type, clip_(d.name, 60), clip_(d.tel, 30), clip_(d.email, 120),
      clip_(d.date || d.checkin, 10), clip_(d.time, 5), clip_(d.nights, 3), clip_(d.people, 4),
      clip_(d.course, 40), clip_(d.purpose, 20), clip_(d.pickup, 3), d.nameplate ? "希望" : "",
      clip_(d.note || d.message, 2000), "未対応", "",
    ].map(safeCell_);
    sh.appendRow(row);

    notify_(id, d);
    if (d.email) autoReply_(id, d);
    return json_({ ok: true, id });
  } catch (x) {
    return json_({ ok: false, error: String(x) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if ((e.parameter.action || "") !== "news") return json_({ ok: true, name: FACILITY });
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEETS.news.name);
  const rows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 5).getValues() : [];
  const items = rows
    .filter((r) => r[2] && String(r[4]).trim() === "○")
    .map((r) => ({
      date: r[0] instanceof Date ? Utilities.formatDate(r[0], "Asia/Tokyo", "yyyy-MM-dd") : String(r[0]),
      tag: String(r[1] || "お知らせ"),
      title: String(r[2]),
      url: /^https?:\/\//.test(String(r[3])) ? String(r[3]) : "",
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 10);
  return json_({ ok: true, items });
}

function check_(d) {
  if (!TYPE_LABEL[d.type]) return "種類が正しくありません";
  if (!d.name || !d.tel) return "お名前と電話番号は必須です";
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return "メールアドレスの形が正しくありません";
  // 同じ電話番号から 1 分に 3 件まで（いたずら対策）
  const cache = CacheService.getScriptCache(), key = "n_" + String(d.tel).replace(/\D/g, "");
  const n = Number(cache.get(key) || 0);
  if (n >= 3) return "続けて送信されています。少し時間をおいてください";
  cache.put(key, String(n + 1), 60);
  return "";
}

function notify_(id, d) {
  const to = NOTIFY_TO || Session.getEffectiveUser().getEmail();
  const lines = [
    `受付番号：${id}`, `種類：${TYPE_LABEL[d.type]}`, `お名前：${d.name}`, `電話：${d.tel}`, `メール：${d.email || "-"}`,
    d.type === "party" ? `日時：${d.date} ${d.time}／${d.course} × ${d.people}名／用途：${d.purpose}／送迎：${d.pickup || 0}名／名入れ：${d.nameplate ? "希望" : "-"}` : "",
    ["stay", "moving", "camp"].includes(d.type) ? `日程：${d.checkin} から ${d.nights}泊・${d.people}名` : "",
    "", "内容：", d.note || d.message || "-", "", "スプレッドシート：" + SpreadsheetApp.getActive().getUrl(),
  ].filter((l) => l !== null);
  MailApp.sendEmail({ to, subject: `【${FACILITY}】新しい${TYPE_LABEL[d.type]}の受付 ${id}`, body: lines.join("\n") });
}

function autoReply_(id, d) {
  const body = [
    `${d.name} 様`, "", `${FACILITY} へのお問い合わせ、ありがとうございます。`, "次の内容で受け付けました。担当よりあらためてご連絡します。",
    d.type === "party" ? "※ご宴会・ご法要は、こちらからのご連絡でご予約が確定します。" : "", "",
    `受付番号：${id}`, `ご用件：${TYPE_LABEL[d.type]}`, "", `お急ぎの場合はお電話でどうぞ：${TEL}`, "", "このメールは送信専用です。",
  ];
  MailApp.sendEmail({ to: d.email, subject: `【${FACILITY}】受付の控え（${id}）`, body: body.join("\n"), name: FACILITY });
}

const clip_ = (v, n) => String(v == null ? "" : v).slice(0, n);
// スプレッドシートの数式として動かないようにする
const safeCell_ = (v) => (typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v);
const json_ = (o) => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
