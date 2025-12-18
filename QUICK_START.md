# 🚀 NEXUS TRADER - 快速啟動指南

## 📦 一鍵安裝與運行

### 方式 1：使用 npm（推薦）

```bash
# 1. 進入項目目錄
cd nexusv3

# 2. 安裝依賴
npm install

# 3. 啟動開發服務器
npm run dev
```

### 方式 2：使用 yarn

```bash
# 1. 進入項目目錄
cd nexusv3

# 2. 安裝依賴
yarn install

# 3. 啟動開發服務器
yarn dev
```

### 方式 3：使用 pnpm（最快）

```bash
# 1. 進入項目目錄
cd nexusv3

# 2. 安裝依賴
pnpm install

# 3. 啟動開發服務器
pnpm dev
```

## ✅ 啟動成功標誌

當您看到以下輸出時，表示啟動成功：

```
  VITE v5.0.8  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

## 🌐 訪問應用

在瀏覽器中打開：
```
http://localhost:3000
```

## 🎯 快速測試流程

### 1. 測試登入頁面（默認頁面）
- ✅ 查看霓虹風格界面
- ✅ 嘗試切換語言（右上角）
- ✅ 點擊「登入」按鈕進入主控台

### 2. 測試主控台（Dashboard）
- ✅ 查看資產卡片
- ✅ 切換交易區域（平台/商戶/會員）
- ✅ 測試篩選功能（全部/買進/賣出）
- ✅ 測試排序功能（時間/金額）
- ✅ 點擊快速操作按鈕
- ✅ 點擊頭像進入個人資料頁

### 3. 測試個人資料頁（Profile）
- ✅ 點擊頭像上傳圖片
- ✅ 編輯暱稱（點擊鉛筆圖標）
- ✅ 切換語言
- ✅ 瀏覽各個菜單項
- ✅ 返回主控台

## 🛠️ 常用命令

| 命令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發服務器 |
| `npm run build` | 構建生產版本 |
| `npm run preview` | 預覽生產構建 |
| `npm run lint` | 運行代碼檢查 |

## 📱 響應式測試

### 桌面端測試
瀏覽器寬度 ≥ 768px 時，應用顯示為手機模擬器樣式（帶邊框和圓角）

### 移動端測試
1. 在瀏覽器中按 F12 打開開發者工具
2. 點擊設備模擬圖標（通常在左上角）
3. 選擇移動設備（如 iPhone 12 Pro）
4. 測試觸摸交互

## 🎨 界面特色

- **暗色主題：** 遊戲風格的深色背景
- **霓虹效果：** 綠色/紅色/藍色的霓虹按鈕
- **流暢動畫：** 頁面切換和元素出現動畫
- **響應式設計：** 適配桌面和移動設備
- **多語言：** 繁中/英文/越南文即時切換

## 🌍 語言切換位置

- **登入頁面：** 右上角下拉選單
- **個人資料頁：** 右上角下拉選單
- **其他頁面：** 通過個人資料頁切換

支持的語言：
- 🇹🇼 繁體中文（默認）
- 🇺🇸 English
- 🇻🇳 Tiếng Việt

## 🐛 常見問題

### 問題 1：依賴安裝失敗
```bash
# 清除 npm 緩存
npm cache clean --force

# 刪除 node_modules
rm -rf node_modules

# 重新安裝
npm install
```

### 問題 2：端口被占用
修改 `vite.config.ts`：
```typescript
export default defineConfig({
  server: {
    port: 3001, // 改為其他端口
  }
})
```

### 問題 3：頁面空白
1. 檢查瀏覽器控制台是否有錯誤
2. 確保已正確安裝所有依賴
3. 嘗試清除瀏覽器緩存

### 問題 4：熱更新不工作
```bash
# 重啟開發服務器
# 按 Ctrl+C 停止
# 然後重新運行
npm run dev
```

## 📊 性能指標

### 預期性能
- **首次加載：** < 2 秒
- **頁面切換：** < 300ms
- **構建時間：** < 30 秒
- **開發服務器啟動：** < 5 秒

### 優化建議
如果性能不佳，可以嘗試：
1. 確保使用最新版本的 Node.js (推薦 v18+)
2. 關閉不必要的瀏覽器擴展
3. 使用 pnpm 替代 npm（更快）

## 🔗 相關鏈接

- **項目結構說明：** 查看 `PROJECT_STRUCTURE.md`
- **詳細安裝指南：** 查看 `SETUP.md`
- **完成情況總結：** 查看 `COMPLETION_SUMMARY.md`
- **項目介紹：** 查看 `README.md`

## 💡 開發提示

### VS Code 推薦擴展
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

### 快捷鍵
- `Ctrl + Shift + P` - 命令面板
- `Ctrl + P` - 快速打開文件
- `F5` - 啟動調試

### 調試技巧
1. 使用 React DevTools 檢查組件狀態
2. 使用瀏覽器的 Network 標籤查看請求
3. 在代碼中使用 `console.log` 進行調試

## ✨ 下一步

項目已準備就緒！您可以：

1. **開始開發新視圖** - 參考已實現的 LoginView、DashboardView、ProfileView
2. **自定義樣式** - 修改 Tailwind 配置或添加自定義 CSS
3. **添加新功能** - 根據需求擴展功能
4. **集成後端 API** - 準備好後端接口後進行集成
5. **優化性能** - 添加 React.memo、useMemo 等優化

## 📞 獲取幫助

如遇到問題：
1. 查看各個 `.md` 文檔文件
2. 檢查瀏覽器控制台錯誤信息
3. 查看終端輸出的錯誤信息
4. 搜索相關技術文檔

---

**祝您開發順利！** 🎉

**更新日期：** 2024-12-18

