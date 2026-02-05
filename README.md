# CRMシステム - 使用方法

## 起動方法

```bash
# サーバー起動
node server.js
```

サーバーは http://localhost:3000 で起動します。

## 初期ログイン情報

- **ユーザー名**: `admin`
- **パスワード**: `admin123`
- **権限**: 管理者

## 実装済み機能

### ✅ フェーズ1: 基盤構築
- SQLiteデータベース
- Expressサーバー
- セッション管理

### ✅ フェーズ2: 認証機能
- ログイン/ログアウト (`/index.html`)
- ダッシュボード (`/dashboard.html`)
- 権限管理（管理者/一般ユーザー）

### ✅ フェーズ3: 顧客管理機能
- **顧客一覧** (`/companies.html`)
  - 顧客の検索
  - 新規登録ボタンから顧客追加
  - 編集・削除（権限制御付き）
- **顧客詳細** (`/company-detail.html?id=1`)
  - 基本情報表示
  - 取引先担当者管理
  - 当方担当者割り当て

### ✅ フェーズ4: 活動ログ機能
- 活動履歴の記録（訪問/電話/メール/会議等）
- 顧客詳細画面での活動履歴表示
- ネクストアクション管理
- 権限制御（作成者のみ編集可）

**API**:
- `GET /api/activities` - 全活動ログ取得
- `GET /api/activities/company/:companyId` - 特定顧客の活動ログ
- `POST /api/activities` - 活動ログ作成
- `PUT /api/activities/:id` - 更新（作成者または管理者のみ）
- `DELETE /api/activities/:id` - 削除（作成者または管理者のみ）

### ✅ フェーズ5: ユーザー管理機能（管理者のみ）
- **ユーザー管理** (`/users.html`)
  - ユーザー一覧表示
  - 新規ユーザー登録
  - ユーザー編集・削除
  - 権限設定（管理者/一般ユーザー）

**API**:
- `GET /api/users` - ユーザー一覧（管理者のみ）
- `POST /api/users` - ユーザー作成（管理者のみ）
- `PUT /api/users/:id` - ユーザー更新（管理者のみ）
- `DELETE /api/users/:id` - ユーザー削除（管理者のみ）

## 画面遷移

1. http://localhost:3000 にアクセス
2. ログイン画面でログイン（admin/admin123）
3. ダッシュボードに遷移
4. サイドバーから各機能にアクセス
   - 📊 ダッシュボード
   - 🏢 顧客一覧
   - 👥 ユーザー管理（管理者のみ表示）

## APIエンドポイント一覧

### 認証
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/me` - 現在のユーザー情報

### 顧客管理
- `GET /api/companies` - 顧客一覧
- `GET /api/companies/:id` - 顧客詳細
- `POST /api/companies` - 顧客作成
- `PUT /api/companies/:id` - 顧客更新（担当者または管理者のみ）
- `DELETE /api/companies/:id` - 顧客削除（管理者のみ）
- `GET /api/companies/:id/contacts` - 取引先担当者一覧
- `GET /api/companies/:id/users` - 当方担当者一覧
- `POST /api/companies/:id/users` - 担当者割り当て
- `DELETE /api/companies/:id/users/:userId` - 担当者割り当て解除

### 取引先担当者
- `GET /api/contacts` - 担当者一覧
- `POST /api/contacts` - 担当者作成
- `PUT /api/contacts/:id` - 担当者更新
- `DELETE /api/contacts/:id` - 担当者削除

### 活動ログ
- `GET /api/activities` - 活動ログ一覧
- `GET /api/activities/company/:companyId` - 特定顧客の活動ログ
- `POST /api/activities` - 活動ログ作成
- `PUT /api/activities/:id` - 活動ログ更新（作成者または管理者のみ）
- `DELETE /api/activities/:id` - 活動ログ削除（作成者または管理者のみ）

### ユーザー管理
- `GET /api/users` - ユーザー一覧（管理者のみ）
- `POST /api/users` - ユーザー作成（管理者のみ）
- `PUT /api/users/:id` - ユーザー更新（管理者のみ）
- `DELETE /api/users/:id` - ユーザー削除（管理者のみ）

## データベース初期化

初回起動時またはデータベースをリセットしたい場合：

```bash
# データベース初期化
node database/init.js

# 管理者ユーザー作成
node database/seed.js
```

## 動作確認

全ての機能が正常に動作していることを確認済みです。

```bash
# API動作テスト
node test-api.js

# データベース確認
node test-db.js
```

## トラブルシューティング

### ログインできない
- データベースが初期化されているか確認: `node database/seed.js`
- 初期ログイン情報を使用: admin/admin123

### 画面が表示されない
- ブラウザのキャッシュをクリア（Ctrl+Shift+Del）
- サーバーが起動しているか確認: http://localhost:3000
- ブラウザのコンソール（F12）でエラーを確認

### 顧客一覧が表示されない
- ログイン後、サイドバーの「顧客一覧」をクリック
- または直接 http://localhost:3000/companies.html にアクセス
- ブラウザコンソールでエラーを確認

### ユーザー管理が表示されない
- 管理者権限でログインしているか確認
- 一般ユーザーはユーザー管理画面にアクセスできません

## 技術スタック

- **フロントエンド**: Vanilla JavaScript, HTML5, CSS3
- **バックエンド**: Node.js, Express
- **データベース**: SQLite (sqlite3)
- **認証**: express-session, bcrypt
