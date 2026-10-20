# こぶしの湯あつま サイト作り直し案（制作サンプル）引き継ぎ書

- 作業フォルダ：~/claude/kobushi-demo/
- 公開：https://miumiumiu4.github.io/kobushi-atsuma-demo/
- GitHub：https://github.com/miumiumiu4/kobushi-atsuma-demo
- 元のサイト：https://www.kobushi-atsuma.com/（全 9 ページを読んで、機能を全部入れた。対応表は README.md）
- 関連：~/claude/hotel-site/（ホテル SaaS の設計書 第2版）

## 2026-10-21
- 9 ページ（トップ・お風呂・レストラン・本館・ムービングハウス・宴会・アクセス・問い合わせ・安心安全）を作って公開
- 非公式の制作サンプルと全ページに表示、検索エンジンには載せない（noindex・robots.txt）
- 元のサイトの写真は使っていない（仮の絵）。文章は施設の事実（料金・時間・メニュー）を中心に書き直し
- Google 連携：フォーム→スプレッドシート＋メール（gas/Code.gs）、お知らせ表示、Google マップ、Google 翻訳、Google カレンダーに仮登録
- 確認済み：スマホ幅で横にはみ出さない、宴会フォームの入力チェック（7 日前・名入れ 14 日前・送迎 28 名）、料金計算、メニュー検索

## 待っていること
- Google 連携のつなぎ込み（Chrome用プロンプト_Google連携をつなぐ.md）。URL をもらったら config.js の GAS_URL に入れて build → push

## 次にやること
- GAS_URL を入れて、実際にフォームを送ってシートとメールを確かめる
- 施設の写真があれば差し替え
- 設計書第2版の予約エンジン（空室カレンダー・事前決済）をこのサイトに載せるかどうか
