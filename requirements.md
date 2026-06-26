# 要件定義書 - Digital Loyalty Stamp Card (MVP)

## 1. プロジェクト概要

### 背景

イギリスの個人経営カフェにおいて、紙のスタンプカードをデジタル化したい。

紙のスタンプカードには以下の課題がある。

* 紛失しやすい
* 印刷コストがかかる
* 顧客の来店履歴を把握できない
* リピーター施策に活用しづらい

### 目的

* アプリのインストール不要で利用できる。
* 来店ごとに簡単にスタンプを付与できる。
* 店舗側の運用負荷を増やさない。
* 無料枠中心で運用できる。
* 3日以内にMVPをリリースする。

### スコープ

#### 含むもの

* デジタルスタンプカード
* QRコードによるスタンプ付与
* 初回ユーザー登録
* 自動ログイン
* スタンプ履歴管理
* 特典交換
* 管理画面

#### 含まないもの（MVP対象外）

* ネイティブアプリ
* PWAのホーム画面追加必須化
* WhatsApp連携
* SMS送信
* プッシュ通知
* 複数店舗対応
* 高度な分析機能
* クーポン配信

---

# 2. ユーザーストーリー

## お客さん

As a customer,
I want to collect stamps without installing an app,
So that I can participate easily.

As a customer,
I want to scan a QR code to receive a stamp,
So that collecting rewards is effortless.

As a customer,
I want my account to be recognized automatically,
So that I don't need to log in every visit.

As a customer,
I want to recover my account if I change devices,
So that I don't lose my stamps.

As a customer,
I want to know when I have earned a reward,
So that I can redeem it.

---

## 店主

As a cafe owner,
I want to show a fixed QR code,
So that I don't need additional operations.

As a cafe owner,
I want to see customer information and stamp history,
So that I can understand repeat customers.

As a cafe owner,
I want to define rewards,
So that I can run loyalty campaigns.

---

# 3. 機能要件

| ID   | 機能名       | 説明                | 優先度 | Phase |
| ---- | --------- | ----------------- | --- | ----- |
| F-01 | 初回登録      | 名前・メールアドレス登録      | 高   | MVP   |
| F-02 | 自動ログイン    | ブラウザ保存された識別子で自動認識 | 高   | MVP   |
| F-03 | 固定QRコード読取 | 店舗のQRコードを読み取る     | 高   | MVP   |
| F-04 | スタンプ付与    | 来店ごとに1スタンプ付与      | 高   | MVP   |
| F-05 | 重複付与防止    | 1日1回まで            | 高   | MVP   |
| F-06 | スタンプ数表示   | 現在のスタンプ数表示        | 高   | MVP   |
| F-07 | 来店履歴表示    | スタンプ取得履歴表示        | 中   | MVP   |
| F-08 | 特典交換      | 規定数達成で利用可能        | 高   | MVP   |
| F-09 | アカウント復旧   | Magic Linkによる復旧   | 中   | MVP   |
| F-10 | 管理者ログイン   | 管理画面              | 高   | MVP   |
| F-11 | 顧客一覧      | 顧客一覧表示            | 中   | MVP   |
| F-12 | 特典設定      | スタンプ数・特典設定        | 中   | MVP   |

---

# 4. 非機能要件

## パフォーマンス

* ページ表示：3秒以内
* スタンプ付与：2秒以内

## セキュリティ

* HTTPS通信
* UUIDによるユーザー識別
* 推測困難なトークン利用
* 管理者権限分離
* スタンプ付与履歴保存

## 可用性

* SLA 99%

## スケーラビリティ

* 顧客数：1,000人程度
* 同時接続：50人程度

---

# 5. 制約条件

## 予算

* 無料枠中心
* 月額0〜10ポンド程度

## 期間

* MVPを3日以内で開発

## 技術スタック

### Frontend

* Next.js 15
* TypeScript
* Tailwind CSS

### Backend

* Supabase
* PostgreSQL
* Supabase Auth（Magic Linkのみ）

### Hosting

* Vercel

### 開発

* Claude Code

---

# 6. 業務フロー

## 初回来店

```text
QRコード読取
↓
名前・メール登録
↓
ユーザー作成
↓
ブラウザへ識別子保存
↓
スタンプ付与
```

## 2回目以降

```text
QRコード読取
↓
ブラウザ識別子を確認
↓
自動ログイン
↓
スタンプ付与
↓
現在のスタンプ数表示
```

## アカウント復旧

```text
メールアドレス入力
↓
Magic Link送信
↓
ログイン
↓
ブラウザ識別子再登録
```

---

# 7. 画面遷移

```text
Landing
│
├── Register
│
├── Stamp Card
│   ├── Current Stamps
│   ├── Reward Status
│   └── Visit History
│
├── Recovery
│
└── Admin
    ├── Dashboard
    ├── Customers
    ├── Stamp History
    └── Rewards
```

---

# 8. データモデル

## users

* id (uuid)
* email
* name
* browser_token
* created_at

## stamps

* id
* user_id
* count
* updated_at

## stamp_histories

* id
* user_id
* granted_at

## rewards

* id
* title
* required_stamp_count
* is_active

## reward_histories

* id
* user_id
* reward_id
* used_at

---

# 9. MVP成功条件

* アプリインストール不要
* 初回登録1分以内
* 2回目以降はQRを読むだけ
* スタンプ付与が10秒以内
* 店主は固定QRコードを提示するだけ
* アカウント復旧がメールのみで完結する
* 無料枠で運用可能

```
```
