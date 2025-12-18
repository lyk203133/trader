# NEXUS TRADER - Vue 3 版本

遊戲點數交易平台 - 使用 Vue 3、Vite、Tailwind CSS 和 Pinia 構建。

## 專案結構

```
nexusvue3/
├── src/
│   ├── assets/          # 樣式文件
│   ├── components/      # 可重用組件
│   ├── composables/     # 組合式函數
│   ├── i18n/           # 多語言翻譯
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia 狀態管理
│   ├── views/          # 頁面組件
│   ├── App.vue         # 根組件
│   └── main.js         # 應用入口
├── public/             # 靜態資源
├── index.html          # HTML 模板
├── package.json        # 依賴配置
├── vite.config.js      # Vite 配置
├── tailwind.config.js  # Tailwind 配置
└── postcss.config.js   # PostCSS 配置
```

## 功能特色

- ✅ 多語言支援（繁體中文、英文、越南文）
- ✅ 響應式設計，支持移動端和桌面端
- ✅ 完整的用戶認證流程
- ✅ 交易管理系統
- ✅ 錢包和提現功能
- ✅ 會員系統和推薦計劃
- ✅ 安全中心
- ✅ 客服系統

## 安裝和運行

### 1. 安裝依賴

```bash
cd nexusvue3
npm install
```

### 2. 啟動開發服務器

```bash
npm run dev
```

應用將在 `http://localhost:5173` 啟動

### 3. 構建生產版本

```bash
npm run build
```

### 4. 預覽生產構建

```bash
npm run preview
```

## 技術棧

- **Vue 3** - 漸進式 JavaScript 框架
- **Vite** - 下一代前端構建工具
- **Vue Router** - 官方路由管理器
- **Pinia** - Vue 3 狀態管理
- **Tailwind CSS** - 實用優先的 CSS 框架
- **Lucide Vue Next** - 美觀的圖標庫

## 主要頁面

- `/login` - 登入頁面
- `/register` - 註冊頁面
- `/dashboard` - 主儀表板
- `/profile` - 用戶個人資料
- `/my-wallet` - 我的錢包
- `/transaction-history` - 交易記錄
- `/membership` - 會員權益
- `/security-center` - 安全中心

## 開發建議

1. 使用 Vue DevTools 進行調試
2. 遵循 Vue 3 Composition API 最佳實踐
3. 保持組件小而專注
4. 使用 TypeScript（可選）增強類型安全

## 授權

本專案僅供學習和演示使用。

