---
name: 潔淨坊清潔工作室 Design System
colors:
  background: "#F6F2EA"
  background-soft: "#FBF8F1"
  surface: "#FFFDF8"
  foreground: "#1F2D27"
  muted-foreground: "#66736C"
  primary: "#2F6D5D"
  primary-strong: "#1C4F42"
  primary-soft: "#DFEEE7"
  accent: "#B97745"
  border: "#D8D1C4"
  focus: "#B97745"
typography:
  family: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans TC, sans-serif"
  display:
    fontSize: "clamp(42px, 14vw, 94px)"
    fontWeight: 900
    lineHeight: 0.98
  heading:
    fontSize: "clamp(28px, 8vw, 50px)"
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
---

## Overview

潔淨坊的第一版定位為「質感居家服務」：安靜、可溝通、重視到府前的需求確認。視覺不走大量裝飾或促銷感，而是以溫暖居家背景、墨綠行動色與清楚資訊層級，讓手機使用者快速知道如何詢問。

## Colors

米白與暖白負責居家感和閱讀舒適度，墨綠作為品牌與主要行動色，焦糖棕只用在輔助重點與焦點狀態。避免單一綠色鋪滿整頁，保留足夠中性色讓清潔服務看起來沉穩。

## Typography

系統字體搭配 `Noto Sans TC` fallback，減少字體載入成本並維持繁體中文可讀性。首頁大標採緊湊行高，內文維持較鬆行高，便於手機閱讀。

## Layout

手機優先：首屏先放品牌、服務主張與聯絡行動，再接情境、流程、細節、地區與 FAQ。桌面版轉為左右首屏構圖，其他段落使用寬版 grid，但不把每個區塊都包成大型卡片。

## Components

按鈕至少 44px 高，圖示使用 lucide-react。卡片只用於單一情境或地區項目；段落用 full-width band 或自然分隔，不做卡片包卡片。所有可操作元素需有明確 focus-visible 狀態。

## Do's and Don'ts

- Do: 以照片、區域、需求範圍引導詢問。
- Do: 未確認內容用保守文字說明。
- Don't: 虛構價格、案例、評論、年資、認證或人物資料。
- Don't: 使用假 LINE 連結或未授權客戶圖片。
