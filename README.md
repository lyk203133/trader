# NEXUS TRADER

遊戲點數交易平台 - React + TypeScript + Vite + Tailwind CSS

## 功能特色

- 🎮 遊戲風格的暗色主題界面
- 🌐 多語言支持（繁體中文、English、Tiếng Việt）
- 💰 點數買賣交易系統
- 👤 用戶個人資料管理
- 🔐 安全中心（密碼/PIN 管理）
- 💳 收款帳戶管理
- 🎁 推廣中心與會員系統
- 📊 交易記錄查詢
- 🔔 通知與公告系統

## 開始使用

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用將在 `http://localhost:3000` 啟動

### 構建生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 技術棧

- **React 18** - UI 框架
- **TypeScript** - 類型安全
- **Vite** - 構建工具
- **Tailwind CSS** - 樣式框架
- **Lucide React** - 圖標庫

## 項目結構

```
nexusv3/
├── src/
│   ├── components/      # 可重用組件
│   ├── views/          # 頁面視圖
│   ├── constants/      # 常量和翻譯
│   ├── types/          # TypeScript 類型定義
│   ├── utils/          # 工具函數
│   ├── App.tsx         # 主應用組件
│   ├── main.tsx        # 應用入口
│   └── index.css       # 全局樣式
├── public/             # 靜態資源
└── index.html          # HTML 模板
```

## 開發說明

- 默認登錄頁面語言為繁體中文
- 可在右上角切換語言
- 所有密碼輸入框支持顯示/隱藏切換
- 支持頭像上傳和暱稱編輯

## License

Private Project

