# Role-Based Access Control (RBAC) Demo App

Next.js 15、NextAuth.js v5、Prismaを使用したロールベースアクセス制御のデモアプリケーションです。

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **認証**: NextAuth.js v5 (Auth.js)
- **認証プロバイダー**: Google OAuth 2.0
- **スタイリング**: Tailwind CSS
- **データベース**: SQLite (開発環境)
- **ORM**: Prisma
- **言語**: TypeScript
- **状態管理**: Zustand
- **Linter/Formatter**: Biome

## 機能

### 認証機能
- Google OAuthによるログイン/ログアウト
- セッション管理
- ユーザー情報の取得と表示（名前、メールアドレス、プロフィール画像）

### ロールベースアクセス制御
以下の5つのロールを実装：
- **Guest** (未ログインユーザー)
- **User** (一般ユーザー)
- **Manager** (マネージャー)
- **Back Office** (バックオフィス)
- **Admin** (管理者)

### APIキーベースの権限管理
ロールベースのアクセス制御に加えて、より柔軟な権限管理のためのAPIキーシステムを実装：

- **管理者機能**:
  - 特定の機能へのアクセス権を持つAPIキーを発行
  - 有効期限の設定
  - APIキーの有効化/無効化
  - 複数の権限を1つのAPIキーに付与可能

- **ユーザー機能**:
  - 管理者から受け取ったAPIキーを登録
  - 登録したAPIキーに応じて追加機能にアクセス可能
  - 登録済みAPIキーの管理（削除など）

- **権限タイプ**:
  - **Reports**: レポート機能へのアクセス
  - **Analytics**: 分析ツールへのアクセス
  - **Advanced Settings**: 高度な設定へのアクセス

### ページ構成とアクセス制御

| ページ | パス | アクセス権限 |
|--------|------|-------------|
| ホームページ | `/` | 全員 |
| ログイン | `/login` | 未認証のみ |
| ダッシュボード | `/dashboard` | 認証済み |
| プロフィール | `/profile` | 認証済み |
| 設定 | `/settings` | 認証済み |
| APIキー管理 | `/api-keys` | 認証済み |
| ビジネスインテリジェンス | `/manager/bi` | Manager, Admin |
| HR評価 | `/manager/hr-evaluation` | Manager, Admin |
| 出張申請 | `/backoffice/business-trip` | Back Office, Admin |
| 経費精算 | `/backoffice/expense-claim` | Back Office, Admin |
| レポート | `/reports` | Reports権限保持者 |
| 分析ツール | `/analytics` | Analytics権限保持者 |
| 高度な設定 | `/advanced-settings` | Advanced Settings権限保持者 |
| 管理画面 | `/admin` | Admin のみ |
| ユーザー管理 | `/admin/users` | Admin のみ |
| APIキー管理（管理者） | `/admin/api-keys` | Admin のみ |

### UI/UX機能
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応
- **折りたたみ可能なサイドバー**: ハンバーガーメニューでサイドバーを展開/折りたたみ可能
- **メニューグループ化**: メニューをグループ化し、各グループを個別に展開/折りたたみ可能
- **動的ページタイトル**: 現在のページ名をヘッダーに表示
- **ロールバッジ**: ユーザーのロールを視覚的に表示
- **多言語対応**: 英語と日本語をサポート（ユーザーごとに設定可能）

### ナビゲーションメニューの動的表示
ユーザーのロールに応じてメニュー項目を表示/非表示：
- **未ログイン時**: Home, Login
- **User権限時**: Dashboard, Profile, Settings, API Keys
- **Manager権限時**: 上記 + Business Intelligence, HR Evaluation
- **Back Office権限時**: User権限 + Business Trip Request, Expense Claim
- **Admin権限時**: 全メニュー + Admin Panel, User Management, API Key Management

### 多言語機能
- **対応言語**: 英語（English）、日本語（Japanese）
- **設定方法**: ユーザー設定ページから言語を選択
- **保存方法**: ユーザーごとにデータベースに言語設定を保存
- **翻訳対象**: メニュー、グループタイトル、ページタイトル、設定画面
- **自動切り替え**: 言語設定変更後、サイドバーメニューやページが自動的に選択した言語で表示

## セットアップ手順

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを編集して、Google OAuth認証情報を設定します：

```env
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### Google OAuth認証情報の取得方法

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. 「APIとサービス」→「認証情報」を選択
4. 「認証情報を作成」→「OAuthクライアントID」を選択
5. アプリケーションの種類を「ウェブアプリケーション」に設定
6. 承認済みのリダイレクトURIに以下を追加：
   - `http://localhost:3000/api/auth/callback/google`
7. クライアントIDとクライアントシークレットを`.env`ファイルに設定

#### NEXTAUTH_SECRETの生成

```bash
openssl rand -base64 32
```

### 3. データベースのマイグレーション

```bash
npx prisma migrate dev
```

### 4. シードデータの投入

```bash
npm run db:seed
```

以下のデモユーザーとAPIキーが作成されます：

**ユーザー：**
- admin@example.com (ADMIN)
- user1@example.com (USER)
- user2@example.com (USER)
- manager@example.com (MANAGER)
- backoffice@example.com (BACKOFFICE)

**デモAPIキー：**
- `DEMO-KEY-REPORTS-2025`: レポート機能のみアクセス可能
- `DEMO-KEY-FULL-ACCESS-2025`: 全ての権限（Reports, Analytics, Advanced Settings）にアクセス可能

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスします。

## プロジェクト構造

```
role-based-app/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── auth/           # NextAuth.js routes
│   │   ├── admin/          # Admin API routes
│   │   │   ├── api-keys/   # API key management
│   │   │   └── change-role/ # User role change
│   │   └── user/           # User API routes
│   │       ├── api-keys/   # User API key registration
│   │       └── language/   # Language preference
│   ├── admin/              # Admin pages
│   │   ├── page.tsx       # Admin dashboard
│   │   ├── users/         # User management
│   │   └── api-keys/      # API key management
│   ├── manager/            # Manager pages
│   │   ├── bi/            # Business intelligence
│   │   └── hr-evaluation/ # HR evaluation
│   ├── backoffice/         # Back office pages
│   │   ├── business-trip/ # Business trip request
│   │   └── expense-claim/ # Expense claim
│   ├── dashboard/          # User dashboard
│   ├── profile/            # User profile
│   ├── settings/           # User settings
│   ├── api-keys/           # User API key management
│   ├── reports/            # Reports (permission required)
│   ├── analytics/          # Analytics (permission required)
│   ├── advanced-settings/  # Advanced settings (permission required)
│   ├── login/              # Login page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/              # React components
│   ├── Header.tsx          # Page header with title
│   ├── Sidebar.tsx         # Collapsible sidebar navigation (i18n)
│   ├── SidebarToggle.tsx   # Sidebar state management (Zustand)
│   ├── ClientLayout.tsx    # Client-side layout wrapper
│   ├── MenuGroup.tsx       # Menu group with expand/collapse
│   ├── SignInButton.tsx    # Sign in button
│   ├── SignOutButton.tsx   # Sign out button
│   ├── RoleBadge.tsx       # Role display badge
│   ├── UserRoleChanger.tsx # Role change component
│   ├── ApiKeyManager.tsx   # Admin API key management
│   ├── UserApiKeyManager.tsx # User API key registration
│   └── LanguageSwitcher.tsx # Language selection component
├── messages/                # Translation files
│   ├── en.json             # English translations
│   └── ja.json             # Japanese translations
├── lib/                     # Utility libraries
│   ├── prisma.ts           # Prisma client
│   └── permissions.ts      # Permission checking helpers
├── prisma/                  # Prisma schema and migrations
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── seed.ts             # Seed data script
├── types/                   # TypeScript type definitions
│   └── next-auth.d.ts      # NextAuth.js types
├── auth.ts                  # NextAuth.js configuration
├── middleware.ts            # Route protection middleware
└── .env                     # Environment variables
```

## セキュリティ考慮事項

- ✅ CSRF対策（NextAuth.js組み込み）
- ✅ セッションの適切な管理
- ✅ 環境変数の安全な管理（.gitignoreに.envを追加）
- ✅ SQLインジェクション対策（Prisma使用）
- ✅ XSS対策（React/Next.jsのデフォルト機能）
- ✅ ミドルウェアによるルート保護
- ✅ ロールベースのアクセス制御

## 管理者機能

管理者（ADMIN）ロールのユーザーは以下の機能にアクセスできます：

1. **ユーザー一覧表示**: すべてのユーザーを確認
2. **ロール変更**: ユーザーのロールを変更（自分自身のロールは変更不可）
3. **APIキー管理**:
   - 特定の権限を持つAPIキーの発行
   - APIキーの有効期限設定
   - APIキーの有効化/無効化
   - 発行済みAPIキーの一覧表示と管理
   - 各APIキーの使用状況（登録ユーザー数）の確認

## APIキー機能の使い方

### 管理者側の操作

1. 管理者としてログイン
2. サイドバーから「API Key Management」を選択
3. 「Create」ボタンをクリック
4. キー名、有効期限、付与する権限を選択
5. 「Generate API Key」をクリック
6. 生成されたAPIキーをコピーしてユーザーに共有

### ユーザー側の操作

1. 一般ユーザーとしてログイン
2. サイドバーから「API Keys」を選択
3. 「Add」ボタンをクリック
4. 受け取ったAPIキーを入力
5. 「Register」をクリック
6. ページがリロードされ、権限に応じた新しいメニューが表示される

### デモAPIキーでのテスト

シードデータで作成されるデモAPIキーを使用してテストできます：

```
DEMO-KEY-REPORTS-2025
```
このキーを登録すると、「Reports」メニューが表示され、レポート機能にアクセスできます。

```
DEMO-KEY-FULL-ACCESS-2025
```
このキーを登録すると、「Reports」「Analytics」「Advanced Settings」の全てのメニューが表示されます。

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# Lint
npm run lint

# フォーマット
npm run format

# Prismaマイグレーション
npx prisma migrate dev

# Prisma Studio（データベースGUI）
npx prisma studio

# シードデータ投入
npm run db:seed
```

## ライセンス

MIT
