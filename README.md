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
以下の3つのロールを実装：
- **Guest** (未ログインユーザー)
- **User** (一般ユーザー)
- **Admin** (管理者)

### ページ構成とアクセス制御

| ページ | パス | アクセス権限 |
|--------|------|-------------|
| ホームページ | `/` | 全員 |
| ログイン | `/login` | 未認証のみ |
| ダッシュボード | `/dashboard` | 認証済み |
| プロフィール | `/profile` | 認証済み |
| 設定 | `/settings` | 認証済み |
| 管理画面 | `/admin` | Admin のみ |
| ユーザー管理 | `/admin/users` | Admin のみ |

### UI/UX機能
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応
- **折りたたみ可能なサイドバー**: ハンバーガーメニューでサイドバーを展開/折りたたみ可能
- **動的ページタイトル**: 現在のページ名をヘッダーに表示
- **ロールバッジ**: ユーザーのロールを視覚的に表示

### ナビゲーションメニューの動的表示
ユーザーのロールに応じてメニュー項目を表示/非表示：
- **未ログイン時**: Home, Login
- **User権限時**: Dashboard, Profile, Settings, Logout
- **Admin権限時**: 上記 + Admin Panel, User Management

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

以下のデモユーザーが作成されます：
- admin@example.com (ADMIN)
- user1@example.com (USER)
- user2@example.com (USER)

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
│   │   └── auth/           # NextAuth.js routes
│   │   └── admin/          # Admin API routes
│   ├── admin/              # Admin pages
│   │   ├── page.tsx       # Admin dashboard
│   │   └── users/         # User management
│   ├── dashboard/          # User dashboard
│   ├── profile/            # User profile
│   ├── settings/           # User settings
│   ├── login/              # Login page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/              # React components
│   ├── Header.tsx          # Page header with title
│   ├── Sidebar.tsx         # Collapsible sidebar navigation
│   ├── SidebarToggle.tsx   # Sidebar state management (Zustand)
│   ├── ClientLayout.tsx    # Client-side layout wrapper
│   ├── SignInButton.tsx    # Sign in button
│   ├── SignOutButton.tsx   # Sign out button
│   ├── RoleBadge.tsx       # Role display badge
│   └── UserRoleChanger.tsx # Role change component
├── lib/                     # Utility libraries
│   └── prisma.ts           # Prisma client
├── prisma/                  # Prisma schema and migrations
│   ├── schema.prisma       # Database schema
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
