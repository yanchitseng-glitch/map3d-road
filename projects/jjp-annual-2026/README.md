# 2026 JJP Design Annual — Architecture of Care

此目錄包含 ChatGPT 依據 2026 年年刊討論提出的 15 頁策展提案初稿。

## 產製方式

1. 使用 `brief.json` 作為既有 `jjp-presentation/build.py` 的輸入。
2. 在 `assets/` 放入所有對應的經授權建築圖像。缺少素材時不得用其他建築影像冒充作品。
3. `care-scale-body.png`、`care-scale-life.png`、`care-scale-society.png` 為概念示意，可由幾何圖解生成，但需確認與策展理念一致。
4. 從 repository 根目錄執行：`/workspace/.openslide-venv/bin/python jjp-presentation/build.py projects/jjp-annual-2026/brief.json /tmp/jjp-annual-2026-v1`（實際輸出路徑可調整）。
5. 檢查全部 15 張預覽與 HTML，修正後再交付 PDF、PPTX、HTML。

## 編輯注意

- 年刊主題、策展分章及設計原則尚屬提案，不是正式定案。
- 本案尚未收到六個專案的正式圖像；在素材補齊前，不應宣稱輸出為完成版。
- 2026 全齡通用住宅實踐獎的正式名稱與得獎資訊需在出版前核驗。
- 此產生器現為 Python、Pillow、python-pptx、LibreOffice 路線，不是 GitHub `open-slide/open-slide` 的 React 編輯器；OpenSlide Python 套件在此是影像讀取器。

## 實際素材清單

| Filename | 內容 |
| --- | --- |
| assets/tmu.jpg | 北醫第一醫療大樓 |
| assets/chimei.jpg | 佳里奇美醫院 |
| assets/mennonite.jpg | 門諾健康管理大樓 |
| assets/taitung-senior.jpg | 東基樂齡長照園區 |
| assets/sanzhi.jpg | 三芝日勝生 |
| assets/yucheng.jpg | 育成社福永續庇護園區 |
| assets/care-scale-body.png | 身體尺度概念圖 |
| assets/care-scale-life.png | 生活尺度概念圖 |
| assets/care-scale-society.png | 社會尺度概念圖 |
