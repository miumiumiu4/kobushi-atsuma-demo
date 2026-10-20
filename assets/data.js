// 施設の情報（元のサイト kobushi-atsuma.com に載っている内容。2026-10-21 時点）
window.SITE_DATA = {
  name: "こぶしの湯あつま",
  catch: "厚真町のラドン泉・宿泊・お食事",
  tel: "0145-26-7126",
  fax: "0145-26-7130",
  zip: "059-1605",
  address: "北海道勇払郡厚真町字本郷229番地の1",

  hours: {
    bath: { open: "10:00", close: "22:00", label: "日帰り入浴" },
    sauna: { open: "10:00", close: "21:00", label: "サウナ" },
    butadon: { open: "11:30", close: "13:30", label: "あつま豚丼" },
  },

  baths: [
    { name: "露天風呂", lead: "四季を眺める、情緒あふれる湯", text: "四季折々の自然を楽しみながら、のんびり寛ぐことができる露天風呂です。", icon: "leaf" },
    { name: "ラドン泉", lead: "ラジウム鉱石のパワーを秘めた泉", text: "強力なイオン化作用で、快い温感を得ることができます。", icon: "spark" },
    { name: "泡風呂", lead: "全身がほどける、人気のお風呂", text: "適度な刺激で全身がリラックス。老若男女を問わない人気風呂です。", icon: "bubble" },
    { name: "うたせ湯", lead: "肩や背中に心地よい刺激", text: "心地よいお湯の刺激が感じられる打たせ湯です。", icon: "drop" },
    { name: "水風呂", lead: "サウナのあとに", text: "ほてった体を適度に冷やします。血管を引き締めることで湯冷め防止の効果があります。", icon: "wave" },
    { name: "サウナ", lead: "広々とした空間で、たっぷり汗を", text: "疲れとストレスを汗と共に流しましょう。10:00〜21:00 にご利用いただけます。", icon: "flame" },
  ],
  bathAmenities: {
    "浴室": ["ボディソープ", "リンスインシャンプー"],
    "脱衣室": ["ロッカー", "ドライヤー", "体重計"],
  },
  bathPrices: [
    { label: "大人（中学生以上）", price: 530 },
    { label: "小人（小学生）", price: 270 },
  ],
  bathTickets: [
    { label: "回数券 大人 12枚", price: 5300, per: 12 },
    { label: "回数券 大人 6枚", price: 2650, per: 6 },
    { label: "回数券 小人 6枚", price: 1350, per: 6 },
  ],
  frontShop: [
    { label: "フェイスタオル", price: 200 },
    { label: "ハブラシ", price: 150 },
    { label: "カミソリ", price: 150 },
  ],

  menu: [
    { cat: "名物", name: "あつま豚丼（普通）", price: 1320, tag: "11:30〜13:30 限定", star: true },
    { cat: "名物", name: "あつま豚丼（特盛）", price: 1640, tag: "11:30〜13:30 限定", star: true },
    { cat: "名物", name: "豚丼セット", price: 1440, tag: "11:30〜13:30 限定", star: true },
    { cat: "名物", name: "あづまジンギスカン定食", price: 1640, star: true },
    { cat: "和食", name: "味噌焼きチキンセット", price: 1090 },
    { cat: "和食", name: "ヘルシーセット", price: 890 },
    { cat: "和食", name: "野菜炒め定食", price: 950 },
    { cat: "和食", name: "あつま産放牧豚ソースカツ丼", price: 1340 },
    { cat: "和食", name: "かつ重", price: 1040 },
    { cat: "和食", name: "あつま産鶏桜姫親子丼", price: 1090 },
    { cat: "麺類", name: "かけそば・ざるそば", price: 690 },
    { cat: "麺類", name: "かき揚げそば", price: 920 },
    { cat: "麺類", name: "おむすび（おふくろ南蛮味噌・ハスカップ）", price: 440 },
    { cat: "麺類", name: "ライス", price: 250 },
    { cat: "洋食", name: "漁師風スパゲティ", price: 990 },
    { cat: "洋食", name: "厚真産ポークハンバーグ定食", price: 1090 },
    { cat: "洋食", name: "ポークハンバーグカレー", price: 1240 },
    { cat: "洋食", name: "昔風オムライス", price: 1040 },
    { cat: "洋食", name: "昔風ナポリタン鉄板焼き", price: 990 },
    { cat: "洋食", name: "お子様ランチ", price: 820 },
    { cat: "洋食", name: "カツカレー", price: 1190 },
    { cat: "中華", name: "あんかけ焼きそば", price: 990 },
    { cat: "中華", name: "あんかけハーフ＆ハーフ（焼きそば・ご飯各半分）", price: 1010 },
    { cat: "中華", name: "ラーメン（味噌・醤油・塩）", price: 950 },
    { cat: "中華", name: "あんかけ海鮮ラーメン（塩味）", price: 1090 },
    { cat: "中華", name: "あんかけラーメン（醤油）", price: 990 },
    { cat: "中華", name: "中華飯", price: 980 },
    { cat: "中華", name: "焼き豚チャーハン", price: 920 },
    { cat: "一品", name: "フライドポテト", price: 500 },
    { cat: "一品", name: "鶏の唐揚げ", price: 700 },
    { cat: "一品", name: "おつまみセット", price: 660 },
    { cat: "飲み物", name: "生ビール（中ジョッキ）", price: 500 },
    { cat: "飲み物", name: "ハイボール", price: 450 },
    { cat: "飲み物", name: "サワー（レモン・グレープフルーツ）", price: 450 },
    { cat: "飲み物", name: "ノンアルコールビール", price: 310 },
    { cat: "飲み物", name: "瓶ビール（中瓶）", price: 500 },
    { cat: "飲み物", name: "冷酒（300ml びん）", price: 800 },
    { cat: "飲み物", name: "焼酎グランブルー（ボトル）", price: 2040 },
    { cat: "飲み物", name: "焼酎（ショット）", price: 600 },
    { cat: "飲み物", name: "ホットコーヒー", price: 380 },
    { cat: "飲み物", name: "アイスコーヒー", price: 380 },
    { cat: "飲み物", name: "コーラ・オレンジジュース・ウーロン茶", price: 350 },
  ],

  rooms: [
    { name: "和室（8畳）", rooms: "202〜210号室", cap: 4, facilities: ["トイレ（ウォシュレット）", "冷蔵庫"] },
    { name: "洋室A（バス付）", rooms: "201号室", cap: 2, facilities: ["バス", "トイレ（ウォシュレット）", "冷蔵庫"] },
    { name: "洋室B（バスなし）", rooms: "211〜216号室", cap: 2, facilities: ["トイレ（ウォシュレット）", "冷蔵庫"] },
  ],
  roomAmenities: ["浴衣", "ハブラシ", "フェイスタオル", "バスタオル", "カミソリ"],

  movingHouse: {
    units: [{ cap: 2, count: 3 }, { cap: 4, count: 3 }],
    // 1名あたりの素泊まり料金（利用人数別）
    pricePerPerson: { 1: 10000, 2: 6000, 3: 4000, 4: 3000 },
    facilities: ["Wi-Fi", "トイレ（ウォシュレット）", "冷蔵庫", "エアコン", "電気暖房パネル", "IHクッキングヒーター", "収納キッチン", "電子レンジ", "バスルーム", "洗濯機"],
    paidAmenities: ["ハブラシ", "フェイスタオル", "バスタオル", "カミソリ", "ブラシ", "シャンプー", "リンス", "ボディーソープ"],
  },

  courses: [
    { name: "こぶしコース", price: 3920, items: ["先付け三点盛り", "茶碗蒸し", "刺身三点盛り", "白身魚甘辛ソース和え", "鶏モモの黒胡椒炒め", "豚すき", "ジェノベーゼパスタ", "稲荷寿司・太巻き", "デザート"] },
    { name: "山つつじコース", price: 4920, items: ["先付け三点盛り", "茶碗蒸し", "刺身四点盛り", "海老チリソース", "鶏モモの黒胡椒炒め", "天ぷら四点盛り", "ジェノベーゼパスタ", "ビーフステーキ玉ねぎソース", "生ちらし", "デザート"] },
    { name: "うぐいすコース", price: 5920, items: ["先付け五点盛り", "茶碗蒸し", "刺身五点盛り", "フルーツトマトとモッツァレラチーズ", "海老チリソース", "鶏モモの黒胡椒炒め", "天ぷら四点盛り", "雲丹風味パスタ", "ローストビーフ", "握り寿司三点", "デザート"], popular: true },
    { name: "慶事コース", price: 6120, items: ["先付け三点盛り", "茶碗蒸し", "フルーツトマトとモッツァレラチーズ", "刺身五点盛り", "白身魚とホタテのポワレ", "牛肉の温玉ポン酢", "いくら丼", "デザート"], celebrate: true },
  ],

  recommends: [
    { title: "パークゴルフ", text: "春からはパークゴルフのシーズン。こぶしの湯を拠点にパークゴルフ三昧の休日を。", url: "http://www.atsuma-kankoukyoukai.jp/parkgolf.html", link: "パークゴルフ場紹介" },
    { title: "スポーツ合宿", text: "近くに全天候型スポーツドームや体育館。合宿の拠点に最適です。", url: "http://www.atsuma-kankoukyoukai.jp/stardome.html", link: "スポーツ合宿に最適！" },
    { title: "ご当地グルメ", text: "あつま豚丼やジンギスカン定食。お食事だけのご利用も歓迎です。", url: "restaurant.html", link: "おすすめメニュー" },
    { title: "EV 充電器 2 台（無料）", text: "駐車場内の EV 充電器ポート 2 台を無料でご利用いただけます。ご利用の際はフロントへ。", url: "access.html#ev", link: "駐車場・EV充電" },
  ],

  links: [
    { name: "厚真町役場", url: "http://www.town.atsuma.lg.jp/" },
    { name: "図書館・プラネタリウム", url: "http://www.town.atsuma.lg.jp/office/reception/environment/facility/tosho/" },
    { name: "浜厚真野原公園サッカー場", url: "http://yagen-football.com/" },
    { name: "大沼野営場", url: "http://www.town.atsuma.lg.jp/office/about/event/camp/" },
    { name: "町内スポーツ施設", url: "http://www.town.atsuma.lg.jp/office/reception/environment/facility/sports_info/" },
    { name: "周文フェリーターミナル", url: "http://www.snf.jp/embark/tomakomai.html" },
    { name: "厚幌ダム", url: "http://apporodam.main.jp/wp/" },
  ],

  // Google スプレッドシートにつなぐまでの、お知らせの見本
  sampleNews: [
    { date: "2026-10-01", tag: "お知らせ", title: "Webサイトをリニューアルしました（制作サンプル）" },
    { date: "2026-04-20", tag: "季節", title: "パークゴルフシーズンが始まりました" },
    { date: "2026-04-01", tag: "設備", title: "駐車場の EV 充電器（2 台）は無料でご利用いただけます" },
  ],
};
