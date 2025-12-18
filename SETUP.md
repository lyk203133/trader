# NEXUS TRADER - 安裝指南

## 快速開始

### 1. 安裝依賴

在 `nexusv3` 資料夾內執行：

```bash
npm install
```

或使用 yarn:

```bash
yarn install
```

或使用 pnpm (推薦):

```bash
pnpm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

應用將在 `http://localhost:3000` 啟動

### 3. 構建生產版本

```bash
npm run build
```

構建產物將輸出到 `dist` 資料夾

### 4. 預覽生產版本

```bash
npm run preview
```

## 項目結構

```
nexusv3/
├── src/
│   ├── components/          # 可重用組件
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── InputField.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── NeonButton.tsx
│   │   └── index.ts
│   ├── views/              # 頁面視圖
│   │   ├── LoginView.tsx
│   │   ├── DashboardView.tsx
│   │   ├── ProfileView.tsx
│   │   └── (其他視圖待實現)
│   ├── constants/          # 常量和配置
│   │   ├── translations.ts # 多語言翻譯
│   │   └── mockData.ts     # 模擬數據
│   ├── types/              # TypeScript 類型定義
│   │   └── index.ts
│   ├── utils/              # 工具函數 (待實現)
│   ├── App.tsx             # 主應用組件
│   ├── main.tsx            # 應用入口
│   └── index.css           # 全局樣式
├── public/                 # 靜態資源
│   └── vite.svg
├── index.html              # HTML 模板
├── package.json            # 項目依賴
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
├── tailwind.config.js      # Tailwind CSS 配置
└── README.md               # 項目說明
```

## 已實現功能

✅ **核心功能**
- 登入頁面 (LoginView)
- 主控台 (DashboardView)
- 個人資料頁面 (ProfileView)
- 多語言支持 (繁中/英文/越南文)
- 響應式設計
- 暗色主題遊戲風格界面

✅ **UI 組件**
- NeonButton - 霓虹按鈕
- InputField - 輸入框 (支持密碼顯示/隱藏)
- Card - 卡片容器
- Badge - 徽章標籤
- LanguageSwitcher - 語言切換器

## 待實現功能

📋 **視圖頁面**
- 註冊頁面 (RegisterView)
- 忘記密碼 (ForgotPasswordView)
- 交易頁面 (TradeBuyView, TradeSellView)
- 交易記錄 (TransactionHistoryView)
- 通知中心 (NotificationsView)
- 點數商城 (PointsMallView)
- 我的錢包 (MyWalletView)
- 提現頁面 (WithdrawView)
- 系統公告 (SystemAnnouncementsView)
- 收款帳戶 (PaymentAccountView)
- 客服中心 (CustomerServiceView)
- 推廣中心 (ReferralView)
- 會員權益 (MembershipView)
- 安全中心 (SecurityCenterView)
- 修改密碼 (ChangePasswordView, ChangePinView)

## 開發建議

### 添加新視圖

1. 在 `src/views/` 創建新的視圖組件 (例如 `NewView.tsx`)
2. 在 `src/App.tsx` 中導入新視圖
3. 在 `renderView()` 函數的 switch 語句中添加對應的 case
4. 在 `src/types/index.ts` 的 `ViewName` 類型中添加新的視圖名稱

### 添加新組件

1. 在 `src/components/` 創建新組件
2. 在 `src/components/index.ts` 中導出
3. 在需要的地方導入使用

### 修改翻譯

編輯 `src/constants/translations.ts` 文件，添加或修改翻譯文本

### 修改模擬數據

編輯 `src/constants/mockData.ts` 文件

## 技術棧

- **React 18** - UI 框架
- **TypeScript** - 類型安全
- **Vite** - 快速構建工具
- **Tailwind CSS** - 原子化 CSS 框架
- **Lucide React** - 精美圖標庫

## 瀏覽器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 故障排除

### 依賴安裝失敗

```bash
# 清除緩存
npm cache clean --force
# 重新安裝
npm install
```

### 端口被占用

修改 `vite.config.ts` 中的端口號：

```typescript
export default defineConfig({
  server: {
    port: 3001, // 改為其他端口
  }
})
```

### TypeScript 錯誤

```bash
# 檢查 TypeScript 配置
npx tsc --noEmit
```

## 聯繫方式

如有問題，請聯繫開發團隊。

---

**版本:** 1.0.0  
**最後更新:** 2024-12-18

