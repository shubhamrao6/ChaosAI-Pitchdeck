const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const slides = [
  '1_Home.html',
  '2_TheProblem.html',
  '3_MarketAnalysis.html',
  '4_TheSolution.html',
  '5_ProcessOverView.html',
  '6_MarketTiming.html',
  '7_MarketOpportunity.html',
  '8_BusinessModel.html',
  '9_Traction.html',
  '10_FundUtilization.html',
  '11_GTMExecution.html',
  '12_TheFounder.html',
  '13_Vision.html',
  '14_TheAsk.html'
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1600, height: 900 });
  
  const outputDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  console.log('Capturing slides...\n');

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const filePath = `file://${path.join(__dirname, slide).replace(/\\/g, '/')}`;
    
    console.log(`[${i + 1}/${slides.length}] Capturing ${slide}...`);
    
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(1000);
    
    const screenshotPath = path.join(outputDir, `slide_${String(i + 1).padStart(2, '0')}.png`);
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: false
    });
    
    console.log(`    ✓ Saved to ${screenshotPath}`);
  }

  console.log('\n✅ All slides captured!');
  console.log(`📁 Screenshots saved in: ${outputDir}`);
  console.log('\nGenerating complete PDF...');

  const pdfDoc = await PDFDocument.create();
  
  for (let i = 0; i < slides.length; i++) {
    const imagePath = path.join(outputDir, `slide_${String(i + 1).padStart(2, '0')}.png`);
    const imageBytes = fs.readFileSync(imagePath);
    const image = await pdfDoc.embedPng(imageBytes);
    
    const page = pdfDoc.addPage([1600, 900]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: 1600,
      height: 900
    });
    
    console.log(`    Added slide ${i + 1} to PDF`);
  }

  const pdfPath = path.join(__dirname, 'ChaosAI_Pitch_Deck.pdf');
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(pdfPath, pdfBytes);

  console.log(`\n📄 Complete PDF created: ${pdfPath}`);
  console.log(`✅ All 14 slides combined into one PDF (1600x900 resolution)`);

  await browser.close();
})();
