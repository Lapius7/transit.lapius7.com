# transit.lapius7.com

[English](README.md)

[transit.lapius7.com](https://transit.lapius7.com) のソースコードです。日本の公共交通機関向けの乗換案内 Web アプリです。Next.js (App Router)、TypeScript、Tailwind CSS で作っており、ブラウザから [Transit API](https://api.transit.ls8h.com/api/docs) を直接呼び出します。このリポジトリは参考用に公開しており、自分でホスティングすることは想定していません。

## 機能

- 駅、バス停、施設、住所のオートコンプリート検索
- 出発、到着、始発、終電の基準での乗換案内検索(経由地、乗換回数の上限、徒歩の回避を指定可能)
- 乗換ステップ、運賃、運行に関する注意事項を含む経路詳細
- 現在地からの検索
- 駅の詳細と発車時刻表
- データ提供元の一覧

## データについて

経路・時刻情報は、Transit API が集約する各事業者の公開データに基づいています。実際の運行とは異なる場合があります。データ提供元は、アプリ下部のフッターから確認できます。

## ライセンス

[MIT](./LICENSE)
