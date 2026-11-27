# 2026-11-27 搜尋曝光優化

本次使用者授權：依更新AI-skill盤查各專案並全面優化，SEO／GEO曝光優先、UI／UX及功能為輔。官網與內部工具分開；不購買廣告、不代發訊息、不修改正式訂單或放寬存取。

## 問題與結果

新增居家、裝潢細清、退租入住3頁，Vite多入口與同一React元件預先輸出正文。首頁原生內連、各頁canonical／OG／Service／Breadcrumb與sitemap同步；頁首段落返回首頁，詢問仍帶公開服務代碼至既有清單，保留個人LINE、價格依需求與原相簿。發布後verify-live涵蓋3個新頁及其資產。

基準main commit：`4e6918e1847869409b6abef2737fdbdbfc205692`。以新提交回退（revert）並重跑既有部署門禁，不回退既有資料。

## 驗證

npm run build、npm run lint、validate-artifact通過（12相簿109圖、2影片原件雜湊／faststart）；搜尋門禁5個HTML、5個sitemap項目。

新增scripts/check-search.mjs，以正式產物核對sitemap檔案、canonical、可索引／可摘要、title／description唯一性、初始HTML H1、og:url及JSON-LD公開引用；自家商家評分不當作評論摘要資格。既有瀏覽器門禁保留，新清潔服務頁已補進版面及操作測試。PR／Actions最終結果以GitHub為準。

本機瀏覽器無可執行引擎，官方瀏覽器下載403，遠端預覽不能連到本機，因此未聲稱本機截圖目視或三引擎已驗。CI通過前不把本機靜態綠燈當成瀏覽器通過；無正式LINE訊息、訂單或Google分析事件測試污染。

## 成效與待辦

- 正式首頁HTTP 200、現有公開搜尋可找到品牌；搜尋結果僅是抽查，不是Google完整收錄量／排名／GSC報告。
- 新頁曝光、自然點擊、AI引用與有效詢問尚未量測，不能保證排名、營收或AI推薦。發布後應核對新頁HTTP與原始HTML，再觀察GSC／Bing收錄和成效。
- Google商家、Search Console、Bing Webmaster及GA4／Ads需帳號資料才可驗證；缺品牌衡量ID不可借其他品牌。華兒園師資／授權照片、收費／名額等補件維持待補。
- 潔美淨11/27搜尋抽查摘要仍有舊統編60214473及9樓之2；正式來源已是61475587及8樓之2。這是搜尋快照延遲的證據，尚未完成引擎重抓；不得把搜尋快照當成復原舊資料的依據。

## 官方依據

- https://developers.google.com/search/docs/appearance/ai-features — 可索引、可摘要、文字可讀及站內連結；無必要AI專用檔或特殊schema。
- https://developers.openai.com/api/docs/bots — OAI-SearchBot、GPTBot與ChatGPT-User用途分開；訓練允許不等於搜尋引用保證。本輪保留既有robots政策。
- https://developers.google.com/search/docs/appearance/structured-data/review-snippet — 自家LocalBusiness評論不符合評論摘要資格；不影響展示原有可查證評論。

2026-11-27 遠端第一輪CI（b829b7a）三引擎通過後，下載375／1440截圖覆核，發現新服務頁缺site-shell頂部預留，麵包屑被固定頁首遮住。已補共用site-shell／skip link及真實位置斷言；裝潢費用文字改為現況評估說法。最終head須重跑原門禁，截圖及最終狀態以新CI與中央交付為準。
