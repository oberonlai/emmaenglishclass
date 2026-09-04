# 在 AI 時代如何學英文 — Emma’s English Class

7 個單元、14 張投影片（單檔版把目錄接在最後，共 15 張）。**一個單元一個 HTML**，改哪一段就開哪個檔，不會動到別的單元。

風格沿用 `ref/` 裡的簡報草稿：暖米白紙面 `#FBF7F3` × 玫瑰粉 `#C98E97`，
每一頁都是同一種版型（頂部色帶 + PART 標籤 + 大標 + 分隔線 + 內容），**不做章節封面頁**。

## 線上網址

| 位置 | 網址 |
|---|---|
| justgirl.me（正式分享用） | <https://www.justgirl.me/ai-english/> |
| GitHub Pages | <https://oberonlai.github.io/emmaenglishclass/> |

更新 justgirl.me 上那份（只推簡報本身，不會動到站上其他東西）：

```bash
instawp sync push emma --path ./ --remote-path ai-english/ \
  --exclude ".git*" "ref" "dist" "README.md" "build.mjs" ".nojekyll"
instawp cache purge emma      # 一定要跑，不然 CDN 會繼續送舊的 deck.css
```

站台前面有 CDN，**改完 CSS／JS 只 push 不 purge 的話，線上會拿到舊的樣式表**，
畫面會變成沒有套用樣式的純文字。

## 檔案結構

```
emmaenglishclass/
├── index.html            開場（第一張就是封面）· 關於 Emma · 今天的五段路   3 張
├── toc.html              目錄頁（按 Space 從任一頁跳過來）
├── 02-mindset.html       Part One      Mindset                     2 張
├── 03-goals.html         Part Two      Specific Goal               1 張
├── 04-ai3p.html          Part Three    AI–3P（P1 / 六種提示詞 / P2 / P3）  4 張
├── 05-review.html        Part Four     Review–3R                   1 張
├── 06-habit.html         Part Five     Learning Habit — SCALE      1 張
├── 07-close.html         收尾          回顧 · Thank you            2 張
├── assets/
│   ├── deck.css          全部樣式（顏色、字級、元件）
│   └── deck.js           翻頁、動畫、QR 產生器（沿用桃園小聚那份引擎）
├── images/
│   ├── logo.png          封面右側的品牌圓形識別
│   └── line-qr.png       Thank you 頁的 LINE 官方帳號 QR
├── ref/                  來源素材（簡報草稿 pptx、成品參考圖，未納入版控）
├── build.mjs             合併成單一檔案供線上分享
└── dist/emmaenglishclass.html   合併後的成品（執行 build.mjs 產生）
```

## 內容大綱

| # | 單元 | 這一段講什麼 |
|---|---|---|
| — | 開場 | 封面 → 關於 Emma（取自 justgirl.me/about）→ 今天的五段路（Mindset → Specific Goal → AI–3P → Review–3R → Learning Habit） |
| 01 | Mindset | 身分認同 Identity × 自我憐憫 Self-Compassion → 「我要學英文」換成「我是一個英文使用者」 |
| 02 | Specific Goal | A1 建立開口自信／A2–B1 紮穩基礎／B2+ 正確度 × 流暢度 × 話題廣度，各自的學習重點 |
| 03 | AI–3P | P1 Practice（三個程度的練習法）→ 六種練習提示詞（附 QR 連到完整提示詞全文）→ P2 Provide Feedback（六種即時回饋）→ P3 Provide Language Resources（Collocations／Chunks／Frameworks） |
| 04 | Review–3R | 回想 Recall → 提取 Retrieve（問題不是不會，是提取速度）→ 變化式重複 |
| 05 | Learning Habit | SCALE：Specific · Consistency · Achievable · Low Friction · Emergency Plan |
| 06 | 收尾 | 五段回顧 → Thank you ＋ LINE 官方帳號 QR |

所有文字都取自 `ref/AI時代如何學英語_簡報草稿 (3).pptx`，只做了分頁與排版，沒有增刪內容。
「今天的五段路」與收尾的「五段回顧」是既有五個 PART 標題的重述；
「關於 Emma」取自 <https://www.justgirl.me/about>，
「六種練習提示詞」取自 <https://www.justgirl.me/2026/09/blog-post-12.html>（頁上的 QR 就是連到這篇）。

## 怎麼放

```bash
# 直接開檔就能放
open index.html

# 或產生單一檔案（可以整包 dist/ 丟到靜態空間；第一張同樣是封面，目錄在最後）
node build.mjs
open dist/emmaenglishclass.html
```

## 操作

| 按鍵 | 動作 |
|---|---|
| `→` | 下一張（到單元最後一張會自動跳下個單元） |
| `←` | 上一張 |
| `Tab` | 全螢幕 |
| `Space` | 回目錄（`toc.html`） |

舞台固定 `1280 × 720`，由 `deck.js` 依視窗大小等比縮放，投影機解析度不同也不會跑版。

## 要改東西的時候

- **改文字**：直接開對應的單元 HTML，找到那段 `<section class="slide">` 改。
- **改顏色／字級**：全部集中在 `assets/deck.css` 最上面的 `:root` 變數。
- **換 QR**：換掉 `images/line-qr.png` 即可（Thank you 頁引用的是這個檔名）。
  想改用程式產生的 QR，`deck.js` 內建 QR 產生器，把 `.qrbox` 換成
  `<div class="qr" data-qr="https://lin.ee/xxxx"></div>` 就會自動畫出來。
- **加一張投影片**：在單元檔裡複製一組 `<section class="slide">`，`data-sec` 是左上角那行小字。
  進場動畫靠元素上的 `class="r"` 加 `style="--d:.2s"` 排順序。
