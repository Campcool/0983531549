# AI-README｜潔淨坊清潔工作室（0983531549）AI 協作交接文件

> **⚠️ 所有 AI 協作規則（必讀）**
> 1. **動手前**：先完整讀完本檔案，了解架構、內容邊界、已知陷阱、進度與待辦。
> 2. **動手後**：完成任何修改，必須更新本檔案的「進度紀錄」與「待辦清單」，再一併 commit。
> 3. 本檔案是唯一的交接依據，寫給 AI 看：請保持精確、可執行、不留模糊描述。
> 4. **所有時間戳一律台灣時間（Asia/Taipei, UTC+8）**。
> 5. **不要把「已完成」寫在沒有實測的項目上**。未驗的事項寫進「本輪明確未驗」。

最後更新：2026-09-10（Claude）— **複驗 Codex 三批、修正三處，另依業主指示移除案例頁 header 相簿導覽。請 Codex 覆審**。
複驗結論：A1／A2／C1 **通過**（A2 四顆 LINE 按鈕實測全過 AA）；**B2 是假綠，已改回未完成**（robots.txt 放在子路徑對爬蟲無效，見陷阱 7）。
本輪 Claude 另修：`handoff-fixes.css` 併回 `style.css`、`c2f7fbd` 的兩個無障礙迴歸。已跑 lint／build／瀏覽器實測。
**給 Codex 的覆審重點見第 6 節本輪紀錄末段。**

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

- `main` — 唯一有效分支，最新已同步至 `fc64ce8`。
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

### FAQ 與案例頁一致性

已改寫 `src/main.jsx` FAQ 第 3 題：承認案例頁有自家案場實拍相簿，同時維持內容邊界，
不放未確認客戶名稱、評論或成果數字；前後對比只使用已確認可公開的素材。

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
| 管理入口 | access code hash | `src/caseAdmin.jsx` — 靜態前端只能降低明文暴露，不能當成真正權限控管 |

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

**4. `caseAdmin.jsx` 仍不是正式權限系統。**
目前已移除 `1549` 明文比對，改用 SHA-256 hash 檢查 access code，並補上照片壓縮失敗時的
`try/finally` UI 復原。這只能避免明文密碼直接出現在 bundle；靜態前端仍無真正上傳權限控管。
該工具只做瀏覽器內 canvas 壓縮、不碰後端，所以**不是資料外洩**，但不要把它當成正式後台。

**5. 圖片是這個站唯一的效能問題。**
首屏傳輸 1,563 KB 中有 1,486 KB（95%）是圖片，JS+CSS 合計僅 78 KB。
`public/` 共 40.6 MB，其中 4.63 MB 是完全沒被引用的死資產。**優化請往圖片方向做，不要動打包設定。**

**6. Windows 環境下掃描腳本輸出中文會炸。**
cp950 主控台跑 Python 輸出繁中會 `UnicodeEncodeError`，前面加 `PYTHONIOENCODING=utf-8`。

**7. 這個部署形式放不了有效的 `robots.txt`（2026-09-10 實測）。**
`robots.txt` 依 RFC 9309 **只在 origin 根目錄生效**，爬蟲只會請求 `https://campcool.github.io/robots.txt`，
不會去讀子路徑的同名檔。實測：

| URL | 狀態 |
|---|---|
| `https://campcool.github.io/robots.txt` | **404**（該根目錄由 `Campcool/campcool.github.io` 決定，該 repo 不存在） |
| `https://campcool.github.io/0983531549/robots.txt` | 200，但**爬蟲不會讀這裡** |

所以 `public/robots.txt` 目前 **0 效果**，其中的 `Disallow` 與 `Sitemap:` 宣告都不生效。
檔案先留著（接自有網域後就會自動生效），但**不要把它當成已完成的 SEO 工作**。

替代方案，兩者都有效：
- 管理頁的 `<meta name="robots" content="noindex, nofollow">` 是頁面層級，**照常有效**，管理頁其實沒有外洩風險。
- `sitemap.xml` 放子路徑本身合法，但失去 robots.txt 指向後，只能在 GSC 手動提交。

**8. 改 LINE 色票要連 `.line-contact-card` 一起改。**
`--color-line` 之外，`style.css` 的 `.line-contact-card` 另有一組硬編碼的 rgba 漸層。
只改變數會漏掉這張卡片。2026-09-10 已一併改為 `#017a35` 系。

---

## 5. 待辦清單（2026-09-10 稽核產出，依施工順序排列）

狀態圖例：`⬜ 未開始` / `🟨 進行中` / `✅ 已完成並實測`

| # | 優先 | 項目 | 位置 | 預估 | 狀態 |
|---|---|---|---|---|---|
| A1 | 🔴 阻斷 | 改寫 FAQ 第 3 題，讓它與案例頁現況一致 | `src/main.jsx:241` | 10 分 | ✅ 已複驗 |
| A2 | 🔴 阻斷 | LINE 按鈕改 `#017A35`、hover `#006B2E`（原白字對比僅 2.26:1，AA 不過） | `src/style.css:13`（已從 handoff-fixes.css 併回） | 10 分 | ✅ 已複驗 |
| A3 | 🔴 阻斷 | 修 `c2f7fbd` 兩個無障礙迴歸：`aria-controls` 指向不存在元素（9/9）、`aria-hidden` 藏掉分類卡與索引卡張數 | `src/cases.jsx`、`style.css` | 30 分 | ✅ **待 Codex 覆審** |
| B1 | 🟠 高 | scenario 背景圖改 `<img loading="lazy">`＋`object-fit:cover`，首屏 1.56 MB → 約 0.8 MB | `src/main.jsx:390`、`style.css` | 1 小時 | ⬜ |
| B2 | 🔴 阻斷 | ~~補 robots.txt~~ ＋ `sitemap.xml`，接 GSC。**robots.txt 這半做不到**（見陷阱 7），剩下的是去 GSC 手動提交 sitemap | GSC 後台 | 30 分 | ⬜ **需業主帳號** |
| B5 | 🟢 中 | 案例頁 header 相簿導覽（9 膠囊 3×3）**已移除**，導覽職責交給下方「案場相簿索引」 | `src/cases.jsx`、`style.css` | 1 小時 | ✅ **待 Codex 覆審** |
| B3 | 🟠 高 | 加數字錨點帶（58 張實拍／9 類相簿／4 區到府）＋風險逆轉三句 | `src/main.jsx` | 2 小時 | ⬜ |
| B4 | 🟠 高 | 首屏位階對調：品牌名縮至 32–40px，價值主張升至 60px＋；加一行計價說明 | `src/style.css`、`main.jsx` | 3 小時 | ⬜ |
| C1 | 🟠 高 | `handleFiles` 補 `try/finally`；移除硬編碼密碼 | `src/caseAdmin.jsx:88`、`:6` | 30 分 | ✅ |
| C2 | 🟡 待決策 | LINE 標誌換官方素材（現為自繪，違反自家 DESIGN.md） | `public/brand/icon-line.svg` | 待業主 | ⬜ |
| C3 | 🟢 中 | 圖片轉 WebP、刪 4.63 MB 死資產、同步 DESIGN.md、CI 加 `pnpm lint` | 多處 | 半天 | ⬜ |
| D1 | 🟡 待討論 | 設計回流機制（定期清潔提醒、老客推薦）— 五段檢查第 5 段完全空白 | — | 需先討論 | ⬜ |

### 待辦細節（施工時展開看）

**A1 完成說明**（守住內容邊界，同時說實話）：
FAQ 已改成「案例頁已整理自家案場實拍相簿」，並明確不放未確認客戶名稱、評論或成果數字。

**A2 完成說明**（白字對比實測）：
`src/handoff-fixes.css` 已覆寫 `--color-line: #017A35`、`--color-line-strong: #006B2E`，並由首頁、案例頁、管理頁三個 React 入口匯入；主 LINE CTA 白字對比達 AA。

**B2 注意**：依可信度設計規則，**自家網站不得對自家服務加 `Review` 或 `AggregateRating` 結構化資料**
（self-serving markup，Google 會取消 rich result 甚至人工處罰）。要放數字請標「服務件數」。
目前 JSON-LD 未誤用這兩者，維持現狀即可。`public/robots.txt` 與 `public/sitemap.xml` 已新增；
Google Search Console 送審仍需有權限的人手動處理。

**C3 死資產清單**（SHA-256 去重＋雙向引用比對確認，皆無任何頁面引用）：
- `public/cases/rental-clearance/` 5 張（1.90 MB）— 是 `case-20260909/` 的逐位元組副本
- `og-image.png`／`og-image-20260909-service-area.png`／`og-image-20260909-line-card.png`（1.87 MB）— 三張內容完全相同
- `brand/favicon.png`／`logo-horizontal.png`／`logo-mark.png`（0.92 MB）

---

## 6. 進度紀錄（倒序）

### 2026-09-10 修首頁 header 導覽與聯絡鈕重疊（Claude）— ⚠️ 請 Codex 覆審

**業主回報**：首頁上方導覽最後一項與右側 LINE／粉專按鈕重疊。**這是既有 bug，不是本日任何一批改動造成的。**

**成因**（實測 900px）：

桌面版（`min-width: 820px`）的 header 是
`grid-template-columns: auto minmax(0, 1fr) auto` / `"brand nav actions"`，grid 佈局本身正確
（nav 欄 209–639、actions 647–840，兩者不重疊）。問題在 **`.desktop-nav a` 有 `min-width: 116px`**：
6 個膠囊硬要 721px，而 `minmax(0, 1fr)` 的欄位只給得出 430px，膠囊便畫到欄位外，
最後一項「服務地區」跑到 814–930，直接蓋住 647 起的聯絡鈕。
`.desktop-nav` 的 `overflow-x: auto` 則會生出橫向捲動條——那正是先前 `4dc02a3`
「fix: remove mobile nav horizontal scroll」修掉過的東西，在桌面版又長回來。

**改法**：

1. `.desktop-nav a` 拿掉 `min-width: 116px`（改 `auto`），padding 與 font-size 改用
   `clamp()` 隨視窗流動，窄桌面自動收斂。
2. 新增 `@media (min-width: 820px) and (max-width: 1399px)`：header 改回兩欄
   `"brand nav"`，`.header-actions` 收起。底部 dock 已提供 LINE／電話／粉專，聯絡動線不受影響。

**斷點怎麼算出來的**（過程留著，避免下次又猜）：膠囊字級在 1308px 後達 clamp 上限 17px，
導覽自然寬固定 811px；同列還要放 logo 204 + 聯絡鈕 193 + gap 16 + 頁緣 128 = 556px，
故需 1367px 才夠。實測 1280px 重疊 39px、1360px 仍溢出 7px 且間距只剩 1px，因此取 1400 為界。

**實測**（首頁，`need` = 導覽自然寬，`have` = 欄位可用寬）：

| 寬度 | 聯絡鈕 | need / have | 溢出 | 碰撞 | 間距 |
|---|---|---|---|---|---|
| 820 | 收起 | 559 / 559 | 無 | 無 | — |
| 1024 | 收起 | 735 / 735 | 無 | 無 | — |
| 1399 | 收起 | 1044 / 1044 | 無 | 無 | — |
| 1400 | 顯示 | 844 / 844 | 無 | 無 | 21px |
| 1920 | 顯示 | 1364 / 1364 | 無 | 無 | 281px |

- 案例頁**不受影響**：`.cases-page .header-actions`（specificity 0,2,0）勝過新規則的
  `.header-actions`（0,1,0），900px 實測聯絡鈕仍顯示、無碰撞、header 84px。
- 行動版不受影響：改動全在 `min-width: 820px` 之內。

**本輪明確未驗**：未測 820px 以下首頁 header 的既有 3 欄網格是否也有類似擠壓。

### 2026-09-10 移除案例頁 header 相簿導覽（Claude，業主指定）— ⚠️ 請 Codex 覆審

**業主回報**：案例頁上方那排導覽「蠻不喜歡但不知道怎麼改」。診斷後由業主選定「直接移除」。

**移除的理由**（三個問題疊在一起）：

1. **配色是借來的，與內容無關**。`.nav-album-1~9` 直接沿用首頁區塊導覽的色票
   （`.nav-needs` / `.nav-services` / …），所以「特殊清潔 除霉」是綠的、「廚房重油汙」是橘的，
   純粹因為排第幾個。顏色不攜帶資訊，眼睛卻一直想找規律——這是視覺雜亂的主因。
   附帶：`.nav-album-3` 與 `.nav-album-5` 各被定義了兩次。
2. **標題長度 3～13 字**（「洗雨棚」vs「20260909 案場紀錄」），硬排 3×3 網格必然參差，
   375px 下文字重疊溢出。
3. **與下方「案場相簿索引」做同一件事，而且做得比較差**。索引卡有分類、張數、圖示，
   上面這排只有裸標題。同一頁用兩個區塊做同一個導覽。

**改法**：

- `cases.jsx` 移除 `<nav className="desktop-nav">` 整塊。
- `style.css` 新增 `.cases-page` 基礎層規則：header 收成單列 `"brand actions"`，
  `--header-height: 72px`（桌面 84px），並讓 `.cases-page .header-actions` 在所有斷點顯示
  （原本行動版是 `display:none`，移除導覽後 header 會太空）。
- 刪除 media query 內的 `.cases-page .desktop-nav` 與 `.cases-page .desktop-nav a`。
- 清除 11 條 `.nav-album-*` 規則與 `:target` 高亮清單中的 9 行。
  **注意**：這些規則與首頁的 `.nav-needs` 等共用選擇器，只能拆開，不能整條刪。

**實測**：

| 斷點 | header 高 | 導覽 | 水平溢出 |
|---|---|---|---|
| 375 | 132px → **75px** | 已移除 | 無（原本文字重疊已消失） |
| 768 | 132px → **81px** | 已移除 | 無 |
| 桌面 | 132px → **77px** | 已移除 | 無 |

- 首頁**未受影響**：導覽仍在、6 個連結、6 個配色各自獨立且全不同、header 維持 104px。
- `pnpm lint` 0 error；`pnpm build` 成功。
- CSS 結構檢查：大括號 409/409 平衡、無孤兒選擇器、`nav-album` 殘留 0 處。

**⚠️ 施工過程的教訓（給下一個 AI）**：我第一次用腳本批次刪 `nav-album` 時，
腳本從「含 nav-album 的那一行」開始收集選擇器，沒有往回抓同一條規則的前置選擇器行，
結果把 `.desktop-nav .nav-needs,` 這類共用規則整條刪掉、留下孤兒選擇器，
會讓首頁 6 個導覽全部套到同一個顏色。已 `git checkout` 還原後改用逐條精確替換。
**共用選擇器清單不要用腳本批次處理。**

**本輪明確未驗**：

- 未確認移除導覽後，是否有使用者仰賴那排快速跳轉（無分析數據可查）。
- 未測 1440px 以上的寬螢幕。

### 2026-09-10 複驗 Codex 三批＋修正三處（Claude）— ⚠️ 請 Codex 覆審

**一、複驗 Codex `aeabee6` / `0590fb0` / `2251288`**

| 待辦 | 結論 | 依據 |
|---|---|---|
| A1 FAQ | ✅ 通過 | 新文案承認案例頁有實拍相簿，同時守住內容邊界 |
| A2 LINE 對比 | ✅ 通過，且比要求更完整 | 四顆按鈕實測：Hero／聯絡卡／dock 皆 **5.47:1**；header 小鈕 **4.74:1**（改前 2.09:1，此顆原本沒列進待辦，Codex 自己補了） |
| C1 caseAdmin | ✅ 通過，做法優於建議 | 改用 `Promise.allSettled` 並行處理，單張失敗不影響其他，另加「N 張失敗」提示 |
| B2 robots/sitemap | ❌ **假綠，已改回 ⬜** | robots.txt 放子路徑對爬蟲無效，實測見陷阱 7 |

**二、Claude 本輪修正**

1. **`handoff-fixes.css` 併回 `style.css` 並刪除該檔**（原檔覆寫有效，但有兩個副作用）
   - `style.css:13` 的舊值 `#06c755` 還留在原地，下一個人讀 style.css 會被誤導——正是本檔陷阱 3 警告的漂移模式，只是搬進了 CSS 內部。
   - **打包 chunk 命名被污染**：189 KB 的 React runtime 原本叫 `style-*.js`，變成 `handoff-fixes-*.js`。已還原。
   - 順手發現 `.line-contact-card` 另有硬編碼的舊綠漸層，只改變數會漏掉（已記為陷阱 8）。
2. **修 `aria-controls` 指向不存在的元素（9/9）**：`album-photo-grid` 容器改為永遠留在 DOM，用 `hidden={!isOpen}` 控制，內容仍條件式渲染，**lazy 效益完全保留**。另加 `.album-photo-grid[hidden]{display:none}`，因為 `display:grid` 會蓋過 `[hidden]` 預設值。
3. **修 `aria-hidden` 藏掉資訊性內容**：hero 分類卡由 `div` 改為 `ul/li` 並移除 `aria-hidden`、加 `aria-label`；索引卡的 `album-index-icon-panel` 移除 `aria-hidden`，只在裝飾性 icon 上保留。CSS 補上 list reset 以免 `ul` 預設縮排破版。

**三、實測驗證**（本地 build 產物，靜態伺服器）

- `pnpm lint` 0 error 0 warning；`pnpm build` 成功，chunk 名已還原為 `style-B6zZGKp5.js`
- `aria-controls` 目標存在：**9/9**（修正前 0/9）
- 抽屜關閉時：`hidden=true`、`display:none`、內部 `<img>` **0 張** → lazy 效益確認保留
- 點開後：`aria-expanded=true`、`hidden=false`、`display:grid`、3 張圖**全部帶 `loading="lazy"`**、同時僅 1 個抽屜開啟
- 鍵盤：觸發元素為 `<button>`，可聚焦、可按 Enter
- 深連結 `#grease-kitchen` 直接開啟頁面會正確展開該相簿
- 分類卡可讀文字已恢復：「一般清潔 15 張 重點清潔 14 張 特殊清潔 13 張 商業廚房 16 張＋影片」
- 375／桌面截圖版面正常，`ul` 改動未破版

**四、本輪明確未驗**

- 未用真正的螢幕閱讀器（NVDA／VoiceOver）測，只驗了 DOM 與 ARIA 屬性正確性
- 未截到抽屜展開後的完整視覺（捲動指令未生效）；但該區塊 CSS 未改動，樣式與 `c2f7fbd` 相同
- 未測 768 斷點（本輪只測 375 與桌面）
- 未跑 Lighthouse

**五、⚠️ 給 Codex 的覆審重點**

1. `.album-photo-grid` 改用 `hidden` 屬性——請確認在你測過的裝置上，關閉時沒有殘留空白間距（`.case-album-section` 的 gap 可能仍計入）。
2. hero 分類卡改成 `ul/li`——請確認 `.hero-category-card:nth-child(n)` 的 `translateY(18px)` 交錯效果在 `li` 上仍如你原本設計，尤其 768 斷點。
3. 四張分類卡的張數（15／14／13／16）**是硬編碼**，目前正確（合計 58），但 `albums` 一改就會漂移。建議改成從 `albums` 計算，你來決定要不要動。
4. `caseAdmin` 的 SHA-256：實測 hash 就是 `SHA-256('1549')`，4 位數字空間全掃 10000 組僅需 **0.001 秒**（第 1550 組破出）。hash 也仍在公開 bundle。功能無妨（工具不碰後端），但**別讓它看起來像有保護**——本檔陷阱 4 的說明已足夠，這裡只是提醒不要再往「加強加密」的方向投資。
5. B2 請不要再嘗試用 `public/robots.txt` 解決——那個路徑先天無效，見陷阱 7。

### 2026-09-10 修正首批阻斷項（Codex，基準 `aeabee6`）— 已驗 lint/build

依本檔待辦先修 A1、A2、B2、C1：

- A1：改寫首頁 FAQ 第 3 題，讓案例頁實拍相簿與內容邊界一致。
- A2：LINE CTA 色票以 `src/handoff-fixes.css` 覆寫為 `#017A35` / `#006B2E`，避免白字對比不足。
- B2：新增 `public/robots.txt` 與 `public/sitemap.xml`；管理工具路徑列為 disallow，sitemap 只列公開首頁與案例頁。
- C1：`caseAdmin.jsx` 移除明文 `1549` 比對，改 hash 檢查；`handleFiles` 改 `Promise.allSettled` 與 `try/finally`，避免單張照片失敗後 UI 卡住。

**驗證**：

- `pnpm lint` 通過。
- `pnpm build` 通過。第一次在受限沙箱內 build 被 Windows 權限擋住，已用外部執行重跑成功。
- `rg` 檢查未再看到 `const password`、`code === password`、舊 LINE 色值或舊 FAQ 文案。

**本輪明確未驗**：

- 未開瀏覽器做 375／768／桌面截圖。
- 未實測 LINE/電話點擊。
- 未送 Google Search Console；B2 仍標 🟨。
- 未處理 B1/B3/B4/C2/C3/D1。

### 2026-09-10 AI Skills 交接規則確認（Codex，基準 `fc64ce8`）— 文件校正

依使用者指定讀取 `D:\AI-Skill\ai-skills\SKILL.md`，並依路由選擇主技能
`D:\AI-Skill\ai-collaboration-handoff\SKILL.md`。判斷結果：

- `ai-skills` 本體內容完整，與使用者貼上的內容一致，暫不需要修正。
- `ai-collaboration-handoff` 預設要求 `AI-HANDOFF.md`，但本專案 `AGENTS.md` 已明確指定
  `AI-README.md` 為唯一 AI 協作交接文件，因此不另建 `AI-HANDOFF.md`，避免雙軌交接。
- 本檔先前仍寫 `main` 最新為 `bbfde70`，但實際 GitHub main 已是 `fc64ce8`；
  本輪已校正交接狀態與進度紀錄。

**本輪明確未驗**：

- 未修改網站功能、樣式或資產。
- 未跑 `pnpm lint` / `pnpm build`。
- 未重新實測 Claude 稽核列出的 10 項待辦是否仍成立；下一輪若施工需逐項複驗。

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
