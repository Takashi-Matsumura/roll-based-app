# Claude Code 開発ガイド

このドキュメントは、Claude Codeを使用してこのプロジェクトを開発する際のガイドラインです。

## プロジェクト概要

Role-Based Access Control (RBAC) デモアプリケーション
- Next.js 15 App Router
- NextAuth.js v5 (Auth.js)
- Prisma + SQLite
- Tailwind CSS 4
- TypeScript
- 多言語対応（英語・日本語）

## 多言語対応（i18n）実装ガイドライン

### アーキテクチャ

```
lib/i18n/
  ├── get-language.ts        # ユーザーの言語設定取得
  └── page-titles.ts         # ページタイトルの翻訳（共通）

app/[module]/
  ├── page.tsx              # モジュールページ
  └── translations.ts       # モジュール固有の翻訳ファイル

components/
  └── [Component].tsx       # Client Componentは props で言語を受け取る
```

### 新しいモジュールを追加する手順

#### 1. 翻訳ファイルの作成

各モジュールディレクトリに `translations.ts` を作成：

```typescript
// app/profile/translations.ts
export const profileTranslations = {
  en: {
    title: "Profile",
    personalInfo: "Personal Information",
    email: "Email",
    role: "Role",
    // ... 他のキー
  },
  ja: {
    title: "プロフィール",
    personalInfo: "個人情報",
    email: "メールアドレス",
    role: "ロール",
    // ... 他のキー
  },
} as const;

export type ProfileTranslationKey = keyof typeof profileTranslations.en;
```

**重要なポイント:**
- `as const` を必ず使用（型安全性のため）
- 英語と日本語で**全く同じキー**を使用
- TypeScript型をexportして型チェックを有効化

#### 2. Server Componentでの使用

```typescript
// app/profile/page.tsx
import { getLanguage } from "@/lib/i18n/get-language";
import { profileTranslations } from "./translations";

export default async function ProfilePage() {
  const language = await getLanguage();
  const t = profileTranslations[language];

  return (
    <div>
      <h1>{t.title}</h1>
      <p>{t.personalInfo}</p>
      {/* ... */}
    </div>
  );
}
```

**ポイント:**
- `getLanguage()` でユーザーの言語設定を取得
- `t.キー` で翻訳にアクセス（オートコンプリート効く）

#### 3. Client Componentでの使用

Client Componentの場合、propsとして言語を受け取る：

```typescript
// components/ProfileCard.tsx
"use client";

interface ProfileCardProps {
  language?: string;
  // ... 他のprops
}

export function ProfileCard({ language = "en", ...props }: ProfileCardProps) {
  // 小規模な翻訳には関数を使用
  const t = (en: string, ja: string) => language === "ja" ? ja : en;

  return (
    <div>
      <button>{t("Edit", "編集")}</button>
      <button>{t("Save", "保存")}</button>
    </div>
  );
}
```

**大規模な翻訳が必要な場合:**

```typescript
// components/ComplexComponent/translations.ts
export const complexComponentTranslations = {
  en: { /* ... */ },
  ja: { /* ... */ },
} as const;

// components/ComplexComponent/ComplexComponent.tsx
"use client";

import { complexComponentTranslations } from "./translations";

export function ComplexComponent({ language = "en" }) {
  const t = complexComponentTranslations[language as "en" | "ja"];
  return <div>{t.someKey}</div>;
}
```

#### 4. ページタイトルの追加

新しいページを追加する場合、ページタイトルも翻訳に追加：

```typescript
// lib/i18n/page-titles.ts に追加
export const pageTitles = {
  en: {
    // ... 既存のタイトル
    "/new-page": "New Page Title",
  },
  ja: {
    // ... 既存のタイトル
    "/new-page": "新しいページタイトル",
  },
} as const;
```

### ベストプラクティス

#### ✅ 推奨される実装

1. **Server Componentでの実装**
   ```typescript
   const language = await getLanguage();
   const t = moduleTranslations[language];
   ```

2. **翻訳キーは意味のある名前を使用**
   ```typescript
   // Good
   title: "Dashboard"
   welcomeMessage: "Welcome to Your Dashboard"

   // Bad
   text1: "Dashboard"
   msg: "Welcome to Your Dashboard"
   ```

3. **長いテキストも翻訳ファイルに**
   ```typescript
   description: "This is a long description that should be in the translation file rather than inline in the component."
   ```

#### ❌ 避けるべき実装

1. **ハードコーディング**
   ```typescript
   // Bad
   <h1>Dashboard</h1>

   // Good
   <h1>{t.title}</h1>
   ```

2. **翻訳の重複**
   ```typescript
   // Bad - 各コンポーネントで重複
   const t = (en, ja) => ...

   // Good - 共通の翻訳ファイルを作成
   ```

3. **型安全性の無視**
   ```typescript
   // Bad
   const translations = { ... }  // as const なし

   // Good
   const translations = { ... } as const
   ```

### トラブルシューティング

**問題: 翻訳が表示されない**
- `getLanguage()` を呼び出しているか確認
- 翻訳ファイルで `as const` を使用しているか確認
- 英語と日本語で同じキーを使用しているか確認

**問題: 型エラーが出る**
- TypeScript型をexportしているか確認
- 翻訳ファイルで `as const` を使用しているか確認

**問題: Client Componentで言語が反映されない**
- propsで `language` を受け取っているか確認
- 親コンポーネントから `language` を渡しているか確認

## 開発時の注意事項

### 1. 新機能開発時のチェックリスト

- [ ] 翻訳ファイル（`translations.ts`）を作成
- [ ] ページタイトルを `page-titles.ts` に追加
- [ ] UI要素（ボタン、ラベルなど）を翻訳
- [ ] コンテンツテキストを翻訳
- [ ] 英語と日本語の両方をテスト

### 2. コミット前の確認

- [ ] 全てのハードコーディングされたテキストを翻訳ファイルに移動
- [ ] 型安全性を確認（`as const` の使用）
- [ ] 英語と日本語で同じキーを使用
- [ ] README.mdの更新（必要に応じて）

### 3. コードレビューのポイント

- 翻訳ファイルが適切に配置されているか
- 型安全性が保たれているか
- ハードコーディングがないか
- Client/Server Componentで適切な実装方法を使用しているか

## リソース

- **翻訳ヘルパー**: `lib/i18n/get-language.ts`
- **ページタイトル管理**: `lib/i18n/page-titles.ts`
- **実装例**: `app/dashboard/` ディレクトリを参照

## 今後の拡張

3言語以上に対応する場合:

```typescript
export const translations = {
  en: { /* ... */ },
  ja: { /* ... */ },
  es: { /* ... */ },  // スペイン語を追加
  fr: { /* ... */ },  // フランス語を追加
} as const;

type Language = "en" | "ja" | "es" | "fr";
```

現在の設計であれば、最小限の変更で他言語に対応可能です。
