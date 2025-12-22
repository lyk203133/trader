# 🚀 快速入門指南

## 📦 安裝步驟

### 1. 進入專案資料夾
```bash
cd nexusvue3
```

### 2. 安裝依賴
```bash
npm install
```

### 3. 啟動開發服務器
```bash
npm run dev
```

應用將在 `http://localhost:5173` 啟動

## 🎯 專案結構說明

```
nexusvue3/
├── src/
│   ├── assets/          # 全域樣式 (main.css)
│   ├── components/      # 可重用組件
│   │   ├── Card.vue
│   │   ├── InputField.vue
│   │   ├── LanguageSwitcher.vue
│   │   └── NeonButton.vue
│   ├── composables/     # 組合式函數
│   │   └── useTranslation.js
│   ├── i18n/           # 多語言翻譯配置
│   │   └── translations.js
│   ├── router/         # Vue Router 配置
│   │   └── index.js
│   ├── stores/         # Pinia 狀態管理
│   │   └── app.js
│   ├── views/          # 頁面組件 (20+ 個視圖)
│   ├── App.vue         # 根組件
│   └── main.js         # 應用入口
├── public/             # 靜態資源
├── index.html          # HTML 模板
├── package.json        # 依賴配置
├── vite.config.js      # Vite 配置
├── tailwind.config.js  # Tailwind 配置
└── README.md           # 專案文檔
```

## 🔑 核心技術

- **Vue 3** - 使用 Composition API
- **Vite** - 快速的構建工具
- **Vue Router** - 路由管理
- **Pinia** - 狀態管理
- **Tailwind CSS** - CSS 框架
- **Lucide Vue Next** - 圖標庫

## 📱 主要功能

### 認證系統
- ✅ 登入 (`/login`)
- ✅ 註冊 (`/register`)
- ✅ 忘記密碼 (`/forgot-password`)

### 主要頁面
- ✅ 儀表板 (`/dashboard`)
- ✅ 個人資料 (`/profile`)
- ✅ 交易記錄 (`/transaction-history`)
- ✅ 通知中心 (`/notifications`)

### 交易功能
- ✅ 購買點數 (`/trade-buy`)
- ✅ 出售點數 (`/trade-sell`)
- ✅ 點數商城 (`/points-mall`)

### 錢包功能
- ✅ 我的錢包 (`/my-wallet`)
- ✅ 提現 (`/withdraw`)

### 帳戶管理
- ✅ 收款帳戶 (`/payment-account`)
- ✅ 安全中心 (`/security-center`)
- ✅ 修改密碼 (`/change-password`)
- ✅ 修改交易密碼 (`/change-pin`)

### 社交功能
- ✅ 推廣中心 (`/referral-center`)
- ✅ 會員權益 (`/membership`)
- ✅ 客服中心 (`/customer-service`)
- ✅ 系統公告 (`/system-announcements`)

## 🌍 多語言支援

支援三種語言：
- 繁體中文 (zh-TW) - 默認
- English (en-US)
- Tiếng Việt (vi-VN)

切換語言：
```javascript
// 在組件中使用
import { useAppStore } from '@/stores/app'
const store = useAppStore()
store.setLang('en-US') // 切換到英文
```

## 🎨 自定義樣式

所有樣式使用 Tailwind CSS，主要顏色方案：
- 主色：Emerald (綠色) - `emerald-500`
- 背景：Slate (深灰) - `slate-900`, `slate-800`
- 危險：Rose (紅色) - `rose-500`
- 資訊：Blue (藍色) - `blue-500`

## 📦 構建生產版本

```bash
npm run build
```

構建文件將輸出到 `dist/` 資料夾

## 🔍 預覽生產構建

```bash
npm run preview
```

## 💡 開發建議

1. **使用 Composition API**
   ```vue
   <script setup>
   import { ref } from 'vue'
   const count = ref(0)
   </script>
   ```

2. **使用 Pinia Store**
   ```javascript
   import { useAppStore } from '@/stores/app'
   const store = useAppStore()
   ```

3. **使用路由導航**
   ```javascript
   import { useRouter } from 'vue-router'
   const router = useRouter()
   router.push('/dashboard')
   ```

4. **使用翻譯功能**
   ```vue
   <script setup>
   import { useTranslation } from '@/composables/useTranslation'
   const { t } = useTranslation()
   </script>
   
   <template>
     <h1>{{ t.appName }}</h1>
   </template>
   ```

## 🐛 常見問題

### 問題：端口被占用
```bash
# 指定其他端口
npm run dev -- --port 3000
```

### 問題：樣式未生效
確保 Tailwind CSS 正確配置，檢查：
1. `tailwind.config.js` 的 content 路徑
2. `src/assets/main.css` 已正確導入

### 問題：圖標不顯示
確保正確導入 Lucide 圖標：
```vue
import { User, Lock } from 'lucide-vue-next'
```

## 📚 學習資源

- [Vue 3 官方文檔](https://vuejs.org/)
- [Vite 文檔](https://vitejs.dev/)
- [Vue Router 文檔](https://router.vuejs.org/)
- [Pinia 文檔](https://pinia.vuejs.org/)
- [Tailwind CSS 文檔](https://tailwindcss.com/)

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

本專案僅供學習和演示使用。

