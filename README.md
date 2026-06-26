# Transit乗換案内

[Transit API](https://api.transit.ls8h.com/api/docs) を利用した、日本の公共交通機関向け乗換案内Webアプリです。Next.js (App Router) + TypeScript + Tailwind CSSで構築されており、サーバー側の処理を持たないSPA構成なので、Node.jsが動く環境であればそのままデプロイできます。

## 機能

- 駅・バス停・施設・住所のオートコンプリート検索
- 出発地・目的地を指定した乗換案内検索(出発/到着/始発/終電基準、経由地、乗換回数上限、徒歩回避、利用モード制限、検索戦略の指定)
- 経路詳細(乗換ステップ、運賃、運行に関する注意事項)
- 現在地からの検索(Geolocation API + 逆引き検索)
- 駅詳細・発車時刻表
- データ提供元(フィード)の表示

## 技術スタック

- [Next.js](https://nextjs.org/) 16 (App Router)
- TypeScript
- Tailwind CSS v4
- APIはすべてブラウザから [Transit API](https://api.transit.ls8h.com/api/docs) を直接呼び出します(CORS許可済み、サーバーサイドの中継は行いません)

## ローカル開発

```bash
npm install
npm run dev
```

`http://localhost:3000` で起動します(`lap.sh:3000` などhostsで別名を割り当てている場合はそちらでもアクセス可能です)。

### 環境変数

`.env.example` をコピーして `.env.local` を作成してください。

```bash
cp .env.example .env.local
```

| 変数名 | 説明 | デフォルト |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Transit APIのベースURL | `https://api.transit.ls8h.com` |

APIキーなどのシークレットは不要です(read-onlyな公開APIを利用しています)。

## ビルド

```bash
npm run build
npm start
```

## VPSへのデプロイ手順(例)

1. リポジトリをclone
   ```bash
   git clone https://github.com/<your-account>/transit.lapius7.com.git
   cd transit.lapius7.com
   npm install
   npm run build
   ```
2. `.env.local` を作成し、必要に応じて `NEXT_PUBLIC_API_BASE_URL` を設定
3. [PM2](https://pm2.keymetrics.io/) などで常駐させる
   ```bash
   pm2 start npm --name transit -- start
   ```
4. Nginxなどでリバースプロキシし、`transit.lapius7.com` ドメインを割り当てる

   ```nginx
   server {
       listen 80;
       server_name transit.lapius7.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
       }
   }
   ```
5. 必要に応じてLet's Encrypt等でHTTPS化

## データについて

経路・時刻情報は [Transit API](https://api.transit.ls8h.com/api/docs) が集約する各事業者公開データに基づいています。実際の運行とは異なる場合があります。データ提供元の一覧はアプリ下部のフッターから確認できます。

## ライセンス

[MIT](./LICENSE)
