# 潔淨坊 Google Ads｜Codex 出圖提示詞

> 用法：在本 repo（`campcool/0983531549`）開 Codex，整段貼上「提示詞」區塊。
> 產出的圖片給 Chrome 插件在「提示詞 4」上傳到 Google Ads 圖片素材與標誌。
> 建立日期：2026-10-03（台灣時間）。

---

## 提示詞

```text
你在 campcool/0983531549 repo 工作。動手前先讀 AGENTS.md 與 AI-README.md 第 2 節「內容邊界」。

【目標】
用 repo 內既有的「實拍案場照片」裁切、調色，產出 Google Ads 搜尋廣告可用的圖片素材與標誌。
這是「把真實照片整理得乾淨好看」，不是生成新圖。

【絕對禁止】
1. 不得用 AI 生成或補畫任何清潔現場、人物、器材、前後對比。
2. 不得移除或改變髒污、汙漬、清潔成果（不能讓照片比實際更乾淨）。
3. 不得在圖上加文字、價格、電話、按鈕、邊框、浮水印或 Logo 疊圖
   （Google 圖片素材政策會拒登疊字與拼貼圖）。
4. 不得使用拼貼圖：public/cases/general-home-cleaning/ 與 public/cases/move-in-cleaning/
   是 LINE 拼圖（cases.jsx 中 isComposite: true），整個資料夾都不要用。
5. 不得使用 *-thumb.jpg（已壓過的小縮圖）。
6. 不得修改 public/、src/ 內任何既有檔案，也不要動網站程式。

【允許的處理】
- 裁切與構圖（主體放在中央安全區，四周保留約 10% 留白，避免被 Google 再裁掉重點）
- 拉正水平／垂直線
- 輕度曝光、白平衡、對比修正（目標：明亮、乾淨、偏自然光，不要過飽和）
- 若畫面出現門牌、文件、螢幕內容、可辨識的屋主臉部 → 局部模糊
- 放大倍率上限 1.15 倍；超過就改用較小的合格尺寸（見規格），不要硬放大

【來源照片（依優先順序挑選，至少涵蓋 5 種不同服務）】
public/cases/site-cleaning-hero.jpg
public/cases/high-cabinet-cleaning.jpg
public/cases/cabinet-detail-cleaning.jpg
public/cases/room-after-work-cleaning.jpg
public/cases/vacuum-dust-cleaning.jpg
public/cases/commercial-kitchen/*.jpg
public/cases/grease-kitchen/*.jpg
public/cases/floor-waxing/*.jpg
public/cases/wood-floor-cleaning/*.jpg
public/cases/floor-adhesive-removal/*.jpg
public/cases/mold-removal/*.jpg
public/cases/paint-cleaning/*.jpg
public/cases/general-cleaning/*.jpg
public/cases/awning-cleaning/*.jpg
選圖原則：主體清楚、光線足、看得出「正在清潔」或「清潔完成的空間」；
避開模糊、過暗、雜物佔滿畫面的照片。

【輸出規格】輸出到 ads/google-ads/images/（新建資料夾）
| 用途 | 比例 | 建議尺寸 | 最小尺寸 | 數量 |
| 橫式圖片 | 1.91:1 | 1200×628 | 600×314 | 5 張 |
| 方形圖片 | 1:1 | 1200×1200 | 300×300 | 5 張 |
| 直式圖片 | 4:5 | 960×1200 | 480×600 | 2 張（選做） |
| 方形標誌 | 1:1 | 1200×1200 | 128×128 | 1 張 |
| 橫式標誌 | 4:1 | 1200×300 | 512×128 | 1 張 |
- 圖片：JPEG，sRGB，quality 85，單檔 < 5 MB
- 標誌：PNG，用 public/brand/logo-mark-transparent.png（512×512）與
  public/brand/logo-horizontal-transparent.png（480×237），白底置中、不變形、
  不重畫 Logo；原圖不夠大時保持原始像素大小置中於畫布，不要放大超過 1.15 倍。
  輸出 logo-square-1200.png 與 logo-landscape-1200x300.png。
- 檔名：<比例>-<服務英文slug>-<流水號>.jpg，例如 landscape-commercial-kitchen-01.jpg、
  square-mold-removal-01.jpg、portrait-floor-waxing-01.jpg

【工具】
用 Node 的 sharp 或 Python Pillow 都可以，寫成可重跑的腳本放在
ads/google-ads/build-ad-images.mjs（或 .py），不要把套件加進網站的 dependencies
（用 pnpm dlx 或暫時安裝即可）。

【交付物】
1. ads/google-ads/images/ 內所有圖片
2. ads/google-ads/images/manifest.csv，欄位：
   output_file, source_file, ratio, width, height, upscale_factor, service, edits
   （edits 寫清楚做了哪些處理，例如「裁切、曝光+0.2、門牌模糊」）
3. ads/google-ads/images/contact-sheet.jpg：所有輸出縮成一張總覽，方便業主一次檢查
4. 更新 AI-README.md 的「進度紀錄」與「待辦清單」（AGENTS.md 規定）

【完成前自我檢查，逐項回報】
□ 每張輸出尺寸與比例符合規格，upscale_factor ≤ 1.15
□ 沒有任何一張來自拼貼資料夾或 *-thumb.jpg
□ 沒有疊字、邊框、浮水印、拼貼
□ 沒有 AI 生成或補畫內容；沒有改變髒污或清潔成果
□ 個資（門牌、文件、臉）已模糊或該照片已排除
□ 至少涵蓋 5 種不同服務
□ public/ 與 src/ 沒有任何異動（git status 確認）
```

---

## 給業主的補充

- 這組圖只用於 **搜尋廣告的圖片素材**（每日 NT$50 的預算下不建議投多媒體或 PMax）。
  Google 審核通過後才會出現，平均 1–2 個工作天。
- 若之後要做「精美設計感」的社群／多媒體橫幅（可加標題字、品牌色 `#2f8f8f`），
  那是另一份提示詞；搜尋廣告圖片素材加字會被拒登，所以這份刻意不加字。
