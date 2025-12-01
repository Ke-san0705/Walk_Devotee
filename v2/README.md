# Walk_Devotee

## 概要
- 位置情報とカメラを使うARG風ミッションゲーム。指定座標で撮影するとストーリーが進行。
- フロントエンドのみ（HTML/CSS/JS）。localStorageでチュートリアル完了や進捗を保持。

## 動かし方
- 前提: カメラ/位置情報を許可できるブラウザ。EXIF付き画像を扱うため exifr (CDN) を利用。
- セキュリティ制約上 file:// ではカメラが動かない場合があるので、`v2` ディレクトリで簡易サーバーを起動して http(s) で開いてください。例:
  - `cd v2; python -m http.server 8000`
  - `cd v2; npx serve .`
- 最初は `Tutorial.html` にアクセス。未完了の場合は `main.js` で自動リダイレクトされます。
- 基本フロー: Tutorial -> Logo -> home -> mission -> detail{n} -> shot -> success/failure -> ending。
- 撮影画面: EXIF の緯度経度 or Geolocation API で座標を取得し、ターゲット座標と比較。7 m 以内なら `success.html`、それ以外は `failure.html` に遷移。距離は URL パラメータと localStorage (`lastDistance`) に保存。

## 画面/ファイル
- `Tutorial.html`: タップでチュートリアル文を表示、完了で `Logo.html` へ。
- `Logo.html`: ローディング・ロゴ演出、数秒後/タップで `home.html`。
- `home.html`: 進捗表示とイントロメッセージ。
- `mission.html`: ミッション一覧（現在は `detail2` のカードのみ表示）。
- `detail1.html` `detail2.html` `detail3.html`: 各ターゲットの写真・説明・撮影導線。
- `shot.html`: カメラ映像取得、シャッター、位置判定、エラー表示・再試行。
- `success.html`: 成功メッセージ。ボタンで `ending.html` へ（進捗更新処理はコメントアウト済み）。
- `failure.html`: 失敗時の再挑戦ボタン。
- `ending.html`: エンディングメッセージの段階表示。
- `main.js`: 共有ロジック（チュートリアルリダイレクト、detail ターゲット情報、距離計算、localStorage 操作）。
- `style.css`: 全体のレイアウト、タイピング演出、カード/カメラUIのスタイル。

## データ/設定メモ
- ターゲット座標は `main.js` の `detailTargets` に定義（東京駅・熱海・京都の緯度経度とタイトル）。
- 成功判定距離: 7 m（`shot.html` の `distance <= 7`）。
- 進捗/状態で使う localStorage キー: `tutorialCompleted`, `currentDetailId`, `successfulDetails`, `progress`, `lastDetailId`, `lastDistance`。

## 備考
- カメラ/位置情報を拒否するとエラー表示になります。許可後に再試行してください。
- EXIF に位置が入らない環境では Geolocation 取得にフォールバックします。
- PC ブラウザでカメラが使えない場合はスマートフォンでの確認がおすすめです。
