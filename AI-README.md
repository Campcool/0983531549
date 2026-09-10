# AI-README｜潔淨坊清潔工作室（0983531549）AI 協作交接文件

> **⚠️ 所有 AI 協作規則（必讀）**
> 1. **動手前**：先完整讀完本檔案，了解架構、內容邊界、已知陷阱、進度與待辦。
> 2. **動手後**：完成任何修改，必須更新本檔案的「進度紀錄」與「待辦清單」，再一併 commit。
> 3. 本檔案是唯一的交接依據，寫給 AI 看：請保持精確、可執行、不留模糊描述。
> 4. **所有時間戳一律台灣時間（Asia/Taipei, UTC+8）**。
> 5. **不要把「已完成」寫在沒有實測的項目上**。未驗的事項寫進「本輪明確未驗」。

最後更新：2026-09-10（Claude）— 建立本檔案；完成首次轉換稽核，產出 10 項待辦，其中 4 項列為阻斷。**尚未動任何程式碼**。
稽核於 `bbfde70` 執行，事後已對 Codex 的 `c2f7fbd` 逐項復驗：**10 項待辦全部仍然成立**。

---

## 1. 專案現況

| 項目 | 值 |
|---|---|
| 站別 | 潔淨坊清潔工作室（居家／裝潢／重點／特殊清潔） |
| 網址 | https://campcool.github.io/0983531549/ |
| 自有網域 | **尚未接**（仍在 Pages 子路徑） |
| 技術棧 | React 19.1 + Vite 6.3，pnpm 10.4.1，無 router |
| 部署 | GitHub Actions（`.github/workflows/deploy.yml`）→ push `main` 自動部署 |
| Pages 來源 | 必須維持 `GitHub Actions`，不要改回分支部署 |
| 轉換目標 | **LINE 諮詢／撥號**（服務站，不是訂單站，不要套租賃站的 KPI） |

### 頁面結構（Vite 多入口 MPA，非 SPA）

四個 HTML 入口各掛一支 jsx，設定在 `vite.config.js` 的 `rollupOptions.input`：

| 入口 | 進入點 | 用途 |
|---|---|---|
| `index.html` | `src/main.jsx` | 首頁 |
| `cases/index.html` | `src/cases.jsx` | 案場相簿（9 相簿／58 張照片） |
| `cases/manage/index.html` | `src/caseAdmin.jsx` | 內部照片壓縮工具（已 noindex） |
| `share/index.html` | 無 jsx，純轉址頁 | LINE 分享預覽用 |

React runtime 已正確拆成共用 chunk（189 KB／gzip 59.7 KB），四個入口共用，**不需要再做 manualChunks**。

### 分支狀況（2026-09-10 實查）

- `main` — 唯一有效分支，最新 `bbfde70`。
- `codex/excel-handoff` — **落後 main 27 個 commit、領先 0**。沒有任何獨有內容，是被遺留的空殼。
  **不要以為那裡有未完成的工作**；確認後可直接刪除。
- 此 repo 從未開過 PR（`gh pr list --state all` 為空），目前是**直推 main** 模式。

---

## 2. 內容邊界（動文案前必讀，這是業主的刻意決定，不是待修）

`DESIGN.md` 的 Do's and Don'ts 已明文規定，**任何 AI 不得自行放寬**：

- **不寫死價格**。費用受坪數、髒污程度、工具耗材、交通與時間影響，一律「確認需求後再說明」。
- **不虛構**價格、案例、評論、年資、認證或人物資料。
- **不使用**未授權客戶圖片、未確認的前後對比或未確認的官方品牌素材。
- 照片只用業主實際提供的案場素材。

> **給接手 AI 的提醒**：稽核時「沒有價格、沒有評論」看起來像轉換率的弱點，
> 但那是內容政策。改善轉換要在**不破壞這條邊界**的前提下做——
> 例如不是編一個價格，而是說明「怎麼計價」；不是補評論，而是把既有的
> 58 張實拍照拉成可查證的數字錨點。

### ⚠️ 目前有一處文案與這條邊界自相矛盾

`src/main.jsx` FAQ 第 3 題目前寫「未取得客戶授權前不放案例照片、評論或前後對比」，
但案例頁此刻就有 9 相簿／58 張實拍照／2 組「清潔前‧清潔後」對比。
FAQ 寫於第一版 `7873e58`，前後對比加於最新 commit `bbfde70`，**文案沒跟上內容**。
見待辦 A1，請優先處理。

---

## 3. 關鍵常數（改動前先全域搜尋，多處重複）

| 常數 | 值 | 出現位置 |
|---|---|---|
| LINE ID | `chenli0775` | `main.jsx`、`cases.jsx`、`index.html` JSON-LD |
| LINE URL | `https://line.me/R/ti/p/~chenli0775` | 三支 jsx 各自宣告一次 |
| 電話 | `0983531549` | jsx、JSON-LD、README |
| FB 粉專 | `https://www.facebook.com/share/1GMwVQdp7J/?mibextid=wwXIfr` | `main.jsx`、`cases.jsx` |
| Vite base | `/0983531549/` | `vite.config.js` |
| 品牌主色 | `--color-primary: #2f8f8f` | `src/style.css:8` |
| 管理密碼 | `1549` | `src/caseAdmin.jsx:6` — **見陷阱 4** |

資產路徑一律走 `assetPath()`（內含 `import.meta.env.BASE_URL`），**不要寫死 `/0983531549/`**。

---

## 4. 已知陷阱（踩過或實測確認）

**1. CSS 背景圖無法 lazy load。**
`main.jsx` 的 scenario 卡片用 `style={{'--scenario-image': url(...)}}` 走 CSS `background-image`。
`loading="lazy"` 只對 `<img>` 有效，所以這 3 張共 767 KB 的圖雖然在首屏之下，仍會立即載入。
頁面 17 個 `<img>` 有 15 個正確標了 lazy，唯獨這幾張漏網。改法見待辦 B1。

**2. `share/index.html` 硬編碼 base 路徑。**
內有兩處寫死 `/0983531549/`（JS 轉址與 fallback 連結），與 `vite.config.js` 的 `base` 脫鉤。
**接自有網域時這兩行會壞**，記得一起改。

**3. `DESIGN.md` 已與實作漂移。** 照著它做會改錯檔案：

| DESIGN.md 指定 | 實際使用 |
|---|---|
| `logo-horizontal.png` | `logo-horizontal-transparent.png` |
| `favicon.png` | `favicon-transparent.png` |
| `og-image.png` | `og-line-square-20260909.png` |
| 大標「潔淨坊／清潔服務」 | 「潔淨坊／清潔工作室」 |

DESIGN.md 指名的三個檔案剛好全是**沒有任何引用的死檔**。

**4. `caseAdmin.jsx` 的密碼是假的安全感。**
`const password = '1549'` 會原封不動打包進公開 JS，view-source 即可見，而且是電話末四碼。
該工具只做瀏覽器內 canvas 壓縮、不碰後端，所以**不是資料外洩**，但不要把它當成保護。

**5. 圖片是這個站唯一的效能問題。**
首屏傳輸 1,563 KB 中有 1,486 KB（95%）是圖片，JS+CSS 合計僅 78 KB。
`public/` 共 40.6 MB，其中 4.63 MB 是完全沒被引用的死資產。**優化請往圖片方向做，不要動打包設定。**

**6. Windows 環境下掃描腳本輸出中文會炸。**
cp950 主控台跑 Python 輸出繁中會 `UnicodeEncodeError`，前面加 `PYTHONIOENCODING=utf-8`。

---

## 5. 待辦清單（2026-09-10 稽核產出，依施工順序排列）

狀態圖例：`⬜ 未開始` / `🟨 進行中` / `✅ 已完成並實測`

| # | 優先 | 項目 | 位置 | 預估 | 狀態 |
|---|---|---|---|---|---|
| A1 | 🔴 阻斷 | 改寫 FAQ 第 3 題，讓它與案例頁現況一致 | `src/main.jsx:241` | 10 分 | ⬜ |
| A2 | 🔴 阻斷 | LINE 按鈕改 `#017A35`、hover `#006B2E`（現況白字對比僅 2.26:1，AA 不過） | `src/style.css:13` | 10 分 | ⬜ |
| B1 | 🟠 高 | scenario 背景圖改 `<img loading="lazy">`＋`object-fit:cover`，首屏 1.56 MB → 約 0.8 MB | `src/main.jsx:390`、`style.css` | 1 小時 | ⬜ |
| B2 | 🔴 阻斷 | 補 `public/robots.txt` 與 `public/sitemap.xml`，接 GSC | 新檔 | 1 小時 | ⬜ |
| B3 | 🟠 高 | 加數字錨點帶（58 張實拍／9 類相簿／4 區到府）＋風險逆轉三句 | `src/main.jsx` | 2 小時 | ⬜ |
| B4 | 🟠 高 | 首屏位階對調：品牌名縮至 32–40px，價值主張升至 60px＋；加一行計價說明 | `src/style.css`、`main.jsx` | 3 小時 | ⬜ |
| C1 | 🟠 高 | `handleFiles` 補 `try/finally`；移除硬編碼密碼 | `src/caseAdmin.jsx:88`、`:6` | 30 分 | ⬜ |
| C2 | 🟡 待決策 | LINE 標誌換官方素材（現為自繪，違反自家 DESIGN.md） | `public/brand/icon-line.svg` | 待業主 | ⬜ |
| C3 | 🟢 中 | 圖片轉 WebP、刪 4.63 MB 死資產、同步 DESIGN.md、CI 加 `pnpm lint` | 多處 | 半天 | ⬜ |
| D1 | 🟡 待討論 | 設計回流機制（定期清潔提醒、老客推薦）— 五段檢查第 5 段完全空白 | — | 需先討論 | ⬜ |

### 待辦細節（施工時展開看）

**A1 建議改法**（守住內容邊界，同時說實話）：
> 「有，案例頁有 9 個相簿共 58 張實拍照與前後對比。所有照片都是自家案場實拍，
> 不使用未經授權的客戶資訊，也不放未經證實的評論或成效數字。」

**A2 色值依據**（白字對比實測）：
`#06C755` = 2.26:1（不過）／`#04A948` = 3.10:1（大字剛好過）／`#017A35` = 5.47:1（AA 全過）。
註：`--color-line-strong: #04a948` 已存在，等於目前 **hover 狀態比常態還合格**。

**B2 注意**：依可信度設計規則，**自家網站不得對自家服務加 `Review` 或 `AggregateRating` 結構化資料**
（self-serving markup，Google 會取消 rich result 甚至人工處罰）。要放數字請標「服務件數」。
目前 JSON-LD 未誤用這兩者，維持現狀即可。

**C3 死資產清單**（SHA-256 去重＋雙向引用比對確認，皆無任何頁面引用）：
- `public/cases/rental-clearance/` 5 張（1.90 MB）— 是 `case-20260909/` 的逐位元組副本
- `og-image.png`／`og-image-20260909-service-area.png`／`og-image-20260909-line-card.png`（1.87 MB）— 三張內容完全相同
- `brand/favicon.png`／`logo-horizontal.png`／`logo-mark.png`（0.92 MB）

---

## 6. 進度紀錄（倒序）

### 2026-09-10 14:30 案例相簿改為 lazy drawers（Codex，`c2f7fbd`）— ⚠️ 待複驗

Codex 把案例頁相簿改成摺疊抽屜，並以 `.hero-category-card` 分類卡取代原本的封面圖堆疊。
改動 `src/cases.jsx`（+223/-114 區間）與 `src/style.css`（+238）。

**Claude 尚未複驗此批**，僅確認它沒有動到本檔待辦清單所列的任何位置
（`main.jsx` 的 FAQ 與 scenario 卡、`style.css:13` 的 LINE 色值、`caseAdmin.jsx`），
10 項待辦逐項復驗後**全部仍然成立**。

下一個接手的 AI 請依規則二第 2、3 項複驗這批：

- 案例頁首屏傳輸量是否真的下降（改抽屜前案例頁 `dist/cases` 為 37 MB 級的資產目錄）
- 摺疊抽屜的鍵盤可達性與 `aria-expanded` 狀態
- 375／768／桌面三斷點下 `.hero-category-card` 的 `translateY(18px)` 錯位是否造成重疊

### 2026-09-10 首次轉換稽核（Claude，於 `bbfde70`）— 未動程式碼

**依據**：`D:\AI-Skill` 的 `uiux-design`（含 `claude/uiux-reading-rhythm-2026-08-30` 分支的閱讀節奏章節）
與 `marketing-growth-conversion` 的獲客五段檢查。稽核對象為線上正式站，
已比對線上 bundle hash（`main-Djfm7mdB.js`）與本地 build 產物一致，確認受檢版本即 `bbfde70`。

**五段檢查結論**：

| 段 | 判定 | 主因 |
|---|---|---|
| 1 觸及 | 🔴 阻斷 | 無 robots.txt／sitemap.xml，未接 GSC，仍在 Pages 子路徑 |
| 2 落地 | 🟠 待修 | 首屏最大字是品牌名（92px）而非結論；「多少錢」未答 |
| 3 說服 | 🔴 阻斷 | 零數字錨點；FAQ 與案例頁自相矛盾；無風險逆轉 |
| 4 行動 | 🟠 待修 | CTA 佈局良好（13 個／三階段＋常駐 dock），但主按鈕對比 2.26:1 |
| 5 回流 | 🔴 缺項 | 無任何回訪／推薦機制 |

**實測通過、不需處理的項目**（列出以免下一個 AI 重複查）：

- 靜態資產引用：8 個原始檔解析出 76 筆路徑，逐一比對 `public/` — **0 缺失**，無壞圖
- `pnpm lint` 0 error 0 warning；`pnpm build` 成功（1632 modules）
- 四個入口正確共用 React shared chunk，無重複打包
- 案場影片 `moov` 在位元組 32（`mdat` 在 37233）→ 支援串流即播，**不需要重新編碼**
- 三斷點實測 375／768／桌面版面皆正常
- skip-link、`:focus-visible` 3px 外框、`prefers-reduced-motion` 均已實作
- 所有 `<img>` 帶 width/height → 無 CLS；線上 console 0 錯誤，14 筆請求全 200
- 圖片解析度合理：79 張點陣圖無一超過 2000px
- JSON-LD 未誤用 `Review`／`AggregateRating` — 符合可信度設計規則

**本輪明確「未驗」（不得當成已完成）**：

- 未跑 Lighthouse，無障礙分數未取得基準值
- 未實測動效在低階手機的 fps
- 未驗證繁中文案在各斷點的斷行（DESIGN.md 提過怕斷成「工作／室」）
- 未測 `cases/manage/` 壓縮工具的實際上傳流程
- 未查 Google Ads 素材與 landing page 的用語一致性（目前不確定此站是否有投放）

**完整稽核報告**：https://claude.ai/code/artifact/15c30c86-eda4-47c8-bb8a-0be3dc154e06

### 2026-09-10 之前

本檔案建立前的歷程請看 `git log`。最近一批（皆為 Codex）：
`bbfde70` 相簿整理／`1d0e896` 商業廚房相簿／`98db408` 行動版聯絡改善／`b120e23` LINE 分享預覽頁。

---

## 7. 協作規則

### 規則一：可直推 main，但事後必須互相複驗

此 repo 目前無 PR 流程。推 main 會直接觸發部署，所以：

- 推之前先 `git pull --ff-only origin main`，確認沒有別人的新 commit。
- 推之後在本檔案「進度紀錄」寫清楚**改了什麼、怎麼驗的、哪些沒驗**。
- 下一個接手的 AI 負責複驗上一批，發現問題寫進待辦，不要默默改掉。

### 規則二：這四類變更必須做行為驗證，不能只跑 build

1. **改到 CTA、聯絡方式、LINE／電話連結** → 實際點一次，確認開得起 LINE
2. **改到圖片載入方式** → 量首屏傳輸量，確認沒有反而變重
3. **改到版面／字級／顏色** → 375／768／桌面三斷點實際截圖看
4. **改到 JSON-LD、meta、robots、sitemap** → 用 Rich Results Test 驗，別只看檔案存在

`pnpm build` 成功不等於畫面對。**CI 綠不等於好看、可用。**

### 規則三：改文案前先讀第 2 節「內容邊界」

這是業主的刻意決定。要放寬任何一條，先問業主，不要自己判斷「這樣轉換比較好」。

### 規則四：改設計語言就要同步 DESIGN.md

新配色、新字體、新間距規則落地後，`DESIGN.md` 要一起改。
現在它已經漂移（見陷阱 3），修的人請順手校正。

### 誰做的：從 commit author 分辨

| AI | commit author |
|---|---|
| Claude | `Claude <noreply@anthropic.com>` |
| Codex | `CodexSandboxOffline <...@bh081036.secom.corp>` |
| Manus | `Campcool <...@users.noreply.github.com>`（與業主手動 commit 混在一起，靠訊息風格區分） |

### 分工建議

- **Codex**：實作、重構、批次修改、資產處理（此站歷來 commit 幾乎都是 Codex）
- **Claude**：稽核、複驗、跨站一致性檢查、文案與轉換設計
- 兩邊都要遵守：**不要在對方沒複驗前宣布「已完成」**

---

## 8. 常用指令

```bash
pnpm install          # 安裝依賴
pnpm dev              # 本機開發
pnpm build            # 建置（產出 dist/）
pnpm lint             # ESLint（目前 0 error 0 warning，請維持）
```

部署：push 到 `main` 即自動觸發，無需手動操作。
