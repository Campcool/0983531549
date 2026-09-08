---
name: 潔淨坊清潔工作室 Design System
colors:
  background: "#F4FAF8"
  background-soft: "#EEF8F5"
  surface: "#FFFFFF"
  foreground: "#23424C"
  muted-foreground: "#526F76"
  primary: "#2F8F8F"
  primary-strong: "#174F5D"
  primary-soft: "#DFF3EF"
  accent: "#7CC4E8"
  mint: "#A7DCC8"
  line: "#06C755"
  line-strong: "#04A948"
  border: "#D8D1C4"
  focus: "#174F5D"
typography:
  family: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans TC, sans-serif"
  display:
    fontSize: "54px mobile / 78px desktop / 86px wide"
    fontWeight: 900
    lineHeight: 0.96
  heading:
    fontSize: "32px mobile / 46px desktop / 50px wide"
    fontWeight: 900
    lineHeight: 1.08
  body:
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.78
rounded:
  sm: "6px"
  md: "8px"
  lg: "18px"
spacing:
  page-padding: "clamp(18px, 5vw, 64px)"
  section-y-mobile: "70px"
  section-y-desktop: "96px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
motion:
  button-press: "jelly scale press, 0.44s"
  card-hover: "lift 4px with soft shadow"
  hero-detail: "slow floating utility icons and subtle shine"
---

## Overview

潔淨坊的第一版定位為「乾淨、讓生活更美好」的質感居家服務：可溝通、重視到府前的需求確認。視覺依本次品牌板建立，以柔和綠、清爽藍、深青綠與柔白作為主系統，搭配已提供的 Logo、分頁小圖示、OG 圖與實際案場照片。

## Colors

柔白與淡藍綠負責乾淨明亮的底色，深青綠作為標題與可信賴感，品牌青綠作為主要行動色，清爽藍和柔和綠作為圖示與輔助層次。LINE 綠只用於 LINE 入口，避免與品牌主色混淆。

## Typography

系統字體搭配 `Noto Sans TC` fallback，減少字體載入成本並維持繁體中文可讀性。首頁大標固定為「潔淨坊 / 清潔服務」兩行，避免瀏覽器任意斷成「工作 / 室」或破壞品牌名稱。內文用短段落，手機上以自然換行閱讀。

## Layout

手機優先：首屏放大品牌 Logo、服務主張與 LINE 行動，再接實際案場紀錄、情境、流程、細節、地區與 FAQ。桌面版轉為左右首屏構圖，Hero 圖片使用實拍案場而非生成居家照；其他段落使用寬版 grid，但不把每個區塊都包成大型卡片。

## Components

按鈕至少 44px 高，圖示使用 lucide-react。LINE CTA 使用文字與通用訊息圖示，不使用未授權的 LINE 官方標誌。首頁品牌使用 `public/brand/logo-horizontal.png`，分頁小圖使用 `public/brand/favicon.png`，社群預覽使用 `public/og-image.png`。卡片只用於單一情境或案場照片項目；段落用 full-width band 或自然分隔，不做卡片包卡片。所有可操作元素需有明確 focus-visible 狀態。

## Motion

互動要像居家服務的柔和回饋，不像遊戲或科技展示。按鈕使用短暫果凍按壓，情境卡片 hover 時輕浮起，Hero 只保留低強度的工具圖示漂浮與光感。所有動畫必須支援 `prefers-reduced-motion`。

## Do's and Don'ts

- Do: 以照片、區域、需求範圍引導詢問。
- Do: 未確認內容用保守文字說明。
- Do: Logo、Favicon、OG 圖與色票需依品牌板維持一致。
- Don't: 虛構價格、案例、評論、年資、認證或人物資料。
- Don't: 使用未授權客戶圖片、未確認的前後對比或未確認的官方品牌素材。
