# ChaosAI Pitch Deck - Screenshot Capture

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Capture all slides:**
   ```bash
   npm run capture
   ```

3. **Output:**
   - Screenshots saved in `screenshots/` folder (slide_01.png to slide_12.png)
   - Each screenshot is 1920x1080px, perfect for presentations

4. **Convert to PDF:**
   - Upload all PNG files to: https://www.ilovepdf.com/jpg_to_pdf
   - Or use: https://smallpdf.com/png-to-pdf
   - Arrange in order (01-12) and download combined PDF

## What It Does

The script:
- Opens each HTML slide in headless Chrome
- Captures full-quality 1920x1080 screenshot
- Saves all images to `screenshots/` folder
- Takes ~30 seconds to capture all 12 slides

## Requirements

- Node.js 16+
- npm

## Troubleshooting

If Puppeteer fails to install, try:
```bash
npm install puppeteer --ignore-scripts
```
