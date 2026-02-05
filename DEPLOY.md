# Renderへのデプロイ方法

## 事前準備

1. [Render.com](https://render.com) でアカウント作成（無料）
2. GitHubアカウントとの連携

## デプロイ手順

### 方法1: render.yamlを使用（推奨）

1. Renderダッシュボードにアクセス
2. "New +" → "Blueprint" を選択
3. GitHubリポジトリを接続: `https://github.com/miyuu0113/CRM`
4. `render.yaml` が自動検出されます
5. "Apply" をクリック

### 方法2: 手動設定

1. Renderダッシュボードにアクセス
2. "New +" → "Web Service" を選択
3. GitHubリポジトリを接続: `https://github.com/miyuu0113/CRM`
4. 以下の設定を入力:

   **Basic Settings:**
   - Name: `crm-system`
   - Environment: `Node`
   - Build Command: `npm install && node database/init.js && node database/seed.js`
   - Start Command: `node server.js`

   **Environment Variables:**
   - `NODE_ENV`: `production`
   - `SESSION_SECRET`: （ランダムな文字列、Renderが自動生成可）
   - `PORT`: `10000`
   - `DB_PATH`: `/var/data/crm.db`

   **Disk:**
   - Add Disk
   - Name: `crm-data`
   - Mount Path: `/var/data`
   - Size: `1 GB`

5. "Create Web Service" をクリック

## デプロイ後

デプロイが完了すると、Renderが自動的にURLを生成します：
- 例: `https://crm-system-xxxx.onrender.com`

## 初期ログイン情報

デプロイ後、以下の情報でログインできます：
- **ユーザー名**: `admin`
- **パスワード**: `admin123`

⚠️ **セキュリティ**: デプロイ後すぐに管理者パスワードを変更してください！

## 重要な注意事項

### 1. データベースの永続化

Renderの無料プランでは、ディスク容量が1GBまで無料で利用できます。`render.yaml`でディスクマウントを設定済みです。

### 2. スリープモード

Renderの無料プランでは、15分間アクセスがないとサービスがスリープします：
- 次回アクセス時に再起動（約30秒）
- データは保持されます

### 3. セキュリティ設定

本番環境では以下を必ず設定してください：

**server.jsの修正（オプション）:**
```javascript
cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,  // HTTPSで必須
    sameSite: 'strict'
}
```

### 4. カスタムドメイン

Renderで独自ドメインを設定する場合：
1. Settings → Custom Domains
2. ドメインを追加
3. DNSレコードを設定

## トラブルシューティング

### デプロイが失敗する

**ログを確認:**
1. Renderダッシュボード → サービスを選択
2. "Logs" タブでエラーを確認

**よくあるエラー:**
- ビルドエラー: `package.json`の依存関係を確認
- データベースエラー: ディスクマウントの設定を確認

### アプリケーションが起動しない

1. 環境変数が正しく設定されているか確認
2. `PORT`は`10000`に設定（Renderのデフォルト）
3. ログで詳細なエラーを確認

### データが消える

無料プランでディスクを設定していない場合、再起動時にSQLiteのデータが消えます。
- ディスクマウント設定を追加（`render.yaml`で設定済み）

## 更新方法

コードを更新してGitHubにプッシュすると、Renderが自動的に再デプロイします：

```bash
git add .
git commit -m "Update: 機能追加"
git push origin main
```

Renderが自動的に：
1. 新しいコードを取得
2. ビルドを実行
3. サービスを再起動

## コスト

### 無料プラン
- 750時間/月のコンピュート時間
- 1GBのディスク容量
- 自動スリープ（15分間非アクティブ）

### 有料プラン（$7/月〜）
- スリープなし
- より多いリソース
- 高速なビルド

## サポート

問題が発生した場合：
1. [Render Documentation](https://render.com/docs)
2. [Render Community](https://community.render.com)
3. GitHubリポジトリのIssues

## セキュリティチェックリスト

デプロイ前に確認：
- ✅ `.env`ファイルが`.gitignore`に含まれている
- ✅ `SESSION_SECRET`が環境変数で設定されている
- ✅ 管理者パスワードを変更する予定がある
- ✅ HTTPS通信が有効（Renderは自動的にHTTPS化）
