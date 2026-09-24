/**
 * export-pptx.js
 * Converts captured slide screenshots into a PowerPoint (.pptx) file.
 *
 * Run AFTER capture-slides.js has generated screenshots/:
 *   npm run capture   <- generates screenshots/slide_01.png ... slide_12.png
 *   npm run pptx      <- generates ChaosAI_Pitch_Deck.pptx
 *
 * Or run both in one go:
 *   npm run export
 */

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const SLIDE_FILES = [
  { file: 'slide_01.png', title: 'Cover'             },
  { file: 'slide_02.png', title: 'The Problem'        },
  { file: 'slide_03.png', title: 'The Gap'            },
  { file: 'slide_04.png', title: 'The Solution'       },
  { file: 'slide_05.png', title: 'How It Works'       },
  { file: 'slide_06.png', title: 'Market Opportunity' },
  { file: 'slide_07.png', title: 'Business Model'     },
  { file: 'slide_08.png', title: 'Traction'           },
  { file: 'slide_09.png', title: 'Fund Utilization'   },
  { file: 'slide_10.png', title: 'The Founder'        },
  { file: 'slide_11.png', title: 'Vision'             },
  { file: 'slide_12.png', title: 'The Ask'            },
];

const screenshotsDir = path.join(__dirname, 'screenshots');
const outputPath     = path.join(__dirname, 'ChaosAI_Pitch_Deck.pptx');

async function buildPptx() {
  console.log('\n🎨 Building PowerPoint presentation...\n');

  // Validate all screenshots exist before starting
  const missing = SLIDE_FILES.filter(s => !fs.existsSync(path.join(screenshotsDir, s.file)));
  if (missing.length > 0) {
    console.error('❌ Missing screenshots — run `npm run capture` first:');
    missing.forEach(s => console.error(`   • screenshots/${s.file}`));
    process.exit(1);
  }

  const pptx = new PptxGenJS();

  // 16:9 widescreen — matches 1360x768 capture viewport
  pptx.layout = 'LAYOUT_WIDE';         // 13.33" x 7.5" (standard 16:9)
  pptx.author  = 'Shubham Rao';
  pptx.company = 'ChaosAI / Entropy Research AI';
  pptx.subject = 'ChaosAI Pre-Seed Pitch Deck — September 2026';
  pptx.title   = 'ChaosAI Pitch Deck';

  for (let i = 0; i < SLIDE_FILES.length; i++) {
    const { file, title } = SLIDE_FILES[i];
    const imgPath = path.join(screenshotsDir, file);

    console.log(`  [${String(i + 1).padStart(2, '0')}/${SLIDE_FILES.length}] Adding slide: ${title}`);

    const slide = pptx.addSlide();

    // Full-bleed image covering the entire slide
    slide.addImage({
      path:    imgPath,
      x:       0,
      y:       0,
      w:       '100%',
      h:       '100%',
      sizing:  { type: 'cover', w: '100%', h: '100%' },
    });
  }

  await pptx.writeFile({ fileName: outputPath });

  console.log(`\n✅ PowerPoint created: ${outputPath}`);
  console.log(`📊 ${SLIDE_FILES.length} slides, 16:9 widescreen (LAYOUT_WIDE)`);
}

buildPptx().catch(err => {
  console.error('\n❌ Failed to build PPTX:', err.message);
  process.exit(1);
});
