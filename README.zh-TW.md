# QuotaMew Docs

[English](README.md) | **繁體中文**

[QuotaMew](https://github.com/YinCheng0106/QuotaMew) 官方網站與文件的原始碼。

QuotaMew 是一款輕量、原生的 macOS 選單列 App，用來查看 AI 程式開發工具的使用量與額度重置時間。

**官方網站：** [quotamew.yincheng.app](https://quotamew.yincheng.app)

## 關於這個專案

這個 repository 包含 QuotaMew 官方網站與文件的原始碼。

主要提供：

- QuotaMew 產品與功能介紹
- QuotaMew 下載頁面
- 安裝與首次啟動指南
- 更新方式
- 疑難排解與常見問題
- 隱私與相容性文件
- 英文與臺灣繁體中文本地化

QuotaMew App 本身則由獨立的 [QuotaMew repository](https://github.com/YinCheng0106/QuotaMew) 維護。

## 技術棧

網站主要使用：

- [Next.js](https://nextjs.org/)
- [Fumadocs](https://fumadocs.dev/)
- TypeScript
- Tailwind CSS
- Bun

專案採用 Next.js App Router，並透過 Fumadocs 處理文件路由、搜尋、MDX 內容與多語系支援。

## 本機開發

### 需求

- Bun
- 與目前專案相依套件相容的 Node.js runtime

Clone repository 並安裝相依套件：

```bash
git clone https://github.com/YinCheng0106/quotamew-docs.git
cd quotamew-docs
bun install
```

啟動開發伺服器：

```bash
bun run dev
```

接著開啟：

```text
http://localhost:3000
```

## 驗證

提交修改前建議執行：

```bash
bun run lint
bun run types:check
bun run build
```

## 多語系

QuotaMew 文件目前提供：

- English — 預設語系
- 繁體中文（台灣）— `zh-TW`

公開網址結構如下：

```text
/
├── /download
├── /docs
└── /docs/...

/zh-TW
├── /zh-TW/download
├── /zh-TW/docs
└── /zh-TW/docs/...
```

修改使用者文件時，英文與繁體中文應維持功能與資訊上的一致，但翻譯應以自然的臺灣繁體中文為主，不需要逐字直譯。

## 部署

正式網站：

**https://quotamew.yincheng.app**

網站目前以 Vercel 部署為主要設計目標。

正式環境應設定：

```env
NEXT_PUBLIC_SITE_URL=https://quotamew.yincheng.app
```

此設定會用於：

- Canonical URL
- Open Graph metadata
- 多語系 alternate links
- 其他正式環境 metadata

文件原始碼維護於 [quotamew-docs repository](https://github.com/YinCheng0106/quotamew-docs)。

## 版本資訊

QuotaMew 的下載資訊由網站中的 release configuration 統一管理。

目前公開版本為 **QuotaMew v0.2.0 RC.1**，這是 v0.2.0 穩定版前的 Release Candidate 與 pre-release。請從 [v0.2.0 RC.1 GitHub Release](https://github.com/YinCheng0106/QuotaMew/releases/tag/v0.2.0-rc.1) 下載 `QuotaMew-v0.2.0-rc.1.dmg`。此 DMG 使用 Apple Development 簽署，但尚未使用 Developer ID 簽署或公證。

發布新的 QuotaMew 版本時，網站應同步更新：

- Release 版本
- DMG 下載網址
- SHA-256 checksum
- 最低支援 macOS 版本
- 簽章與 notarization 狀態
- Automatic Update 可用狀態

只有在對應的 GitHub Release 與下載檔案完成驗證後，網站才應將該版本標示為可下載。

## 相關專案

### QuotaMew

macOS App 原始碼、Release、Issue 與開發文件皆由主要 repository 維護：

[github.com/YinCheng0106/QuotaMew](https://github.com/YinCheng0106/QuotaMew)

## 參與貢獻

歡迎針對網站與文件提交範圍明確的修正與改善。

進行修改時請注意：

- 適用時保持英文與繁體中文文件內容一致。
- 不要將尚未完成的功能描述成已正式提供。
- Beta 的限制與安全性說明必須保持正確。
- 確認文件連結與多語系路由正常。
- 提交 Pull Request 前執行專案驗證指令。

如果是 QuotaMew App 本身的 Bug 或功能建議，請前往主要的 [QuotaMew repository](https://github.com/YinCheng0106/QuotaMew)。

## 授權

網站原始碼與文件採用 [MIT License](LICENSE) 授權。

QuotaMew 名稱、Logo 與品牌素材不因本授權而授予第三方作為其他產品品牌識別使用。
