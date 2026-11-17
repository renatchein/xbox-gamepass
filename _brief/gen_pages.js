// Generator for XboxGamePass report pages (PBIR V2). Run with: node gen_pages.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const REPORT = path.join(ROOT, 'XboxGamePass.Report');
const PAGES_DIR = path.join(REPORT, 'definition', 'pages');

const VC_SCHEMA = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.9.0/schema.json';
const PAGE_SCHEMA = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/page/2.1.0/schema.json';

function hexId(n = 20) { return crypto.randomBytes(n / 2).toString('hex'); }
function lit(v) { return { expr: { Literal: { Value: v } } }; }
function litColor(hex) { return { solid: { color: lit(`'${hex}'`) } }; }

function colExpr(entity, property) {
  return { field: { Column: { Expression: { SourceRef: { Entity: entity } }, Property: property } }, queryRef: `${entity}.${property}`, nativeQueryRef: property };
}
function measExpr(entity, property) {
  return { field: { Measure: { Expression: { SourceRef: { Entity: entity } }, Property: property } }, queryRef: `${entity}.${property}`, nativeQueryRef: property };
}

const DARK_BG = '#0C0C0C';
const SURFACE = '#1A1A1A';
const ACCENT = '#107C10';
const TEXT1 = '#FFFFFF';
const TEXT2 = '#B3B3B3';

// ---------- Visual builders ----------

function textboxTitle(text, x, y, w, h) {
  return {
    $schema: VC_SCHEMA,
    name: hexId(),
    position: { x, y, z: 1000, height: h, width: w, tabOrder: 1000 },
    visual: {
      visualType: 'textbox',
      objects: {
        general: [{ properties: { paragraphs: [{ textRuns: [{ value: text, textStyle: { fontFamily: 'Segoe UI Semibold', fontSize: '22px', color: TEXT1 } }], horizontalTextAlignment: 'left' }] } }]
      },
      visualContainerObjects: {
        background: [{ properties: { show: lit('false') } }],
        border: [{ properties: { show: lit('false') } }],
        padding: [{ properties: { top: lit('0D'), bottom: lit('0D'), left: lit('0D'), right: lit('0D') } }]
      }
    }
  };
}

function navButton(label, x, y, w, h, targetPageName) {
  return {
    $schema: VC_SCHEMA,
    name: hexId(),
    position: { x, y, z: 1000, height: h, width: w, tabOrder: 1000 },
    visual: {
      visualType: 'actionButton',
      objects: {
        text: [
          { properties: { show: lit('true') } },
          { properties: { text: lit(`'${label}'`), fontSize: lit('11D'), fontColor: litColor(TEXT1), horizontalAlignment: lit("'center'") }, selector: { id: 'default' } }
        ],
        icon: [
          { properties: { show: lit('false') } },
          { properties: { shapeType: lit("'blank'"), placement: lit("'left'") }, selector: { id: 'default' } }
        ],
        fill: [
          { properties: { show: lit('true') } },
          { properties: { fillColor: litColor(SURFACE) }, selector: { id: 'default' } },
          { properties: { fillColor: litColor(ACCENT) }, selector: { id: 'hover' } }
        ],
        outline: [{ properties: { show: lit('false') } }],
        shape: [
          { properties: { tileShape: lit("'rectangleRounded'"), roundEdge: lit('8L') } },
          { properties: { tileShape: lit("'rectangleRounded'") }, selector: { id: 'default' } }
        ]
      },
      visualContainerObjects: {
        background: [{ properties: { show: lit('false') } }],
        border: [{ properties: { show: lit('false') } }],
        visualLink: [{ properties: { show: lit('true'), type: lit("'PageNavigation'"), navigationSection: lit(`'${targetPageName}'`), tooltip: lit(`'Go to ${label}'`) } }]
      },
      drillFilterOtherVisuals: true
    },
    howCreated: 'InsertVisualButton'
  };
}

function ctaButton(label, x, y, w, h, targetPageName) {
  const v = navButton(label, x, y, w, h, targetPageName);
  v.visual.objects.text[1].properties.fontSize = lit('13D');
  v.visual.objects.fill[1].properties.fillColor = litColor(ACCENT);
  v.visual.objects.fill[2].properties.fillColor = litColor('#14A814');
  v.visual.objects.text[1].properties.fontColor = litColor('#0C0C0C');
  return v;
}

function htmlContent(measureName, x, y, w, h) {
  return {
    $schema: VC_SCHEMA,
    name: hexId(),
    position: { x, y, z: 1000, height: h, width: w, tabOrder: 1000 },
    visual: {
      visualType: 'htmlContent443BE3AD55E043BF878BED274D3A6855',
      query: { queryState: { content: { projections: [measExpr('_Measures', measureName)] } } },
      drillFilterOtherVisuals: true,
      visualContainerObjects: {
        visualHeader: [{ properties: { show: lit('false') } }],
        visualTooltip: [{ properties: { show: lit('false') } }],
        background: [{ properties: { show: lit('false') } }],
        border: [{ properties: { show: lit('false') } }]
      }
    }
  };
}

function dropdownSlicer(entity, column, headerText, x, y, w, h) {
  return {
    $schema: VC_SCHEMA,
    name: hexId(),
    position: { x, y, z: 1000, height: h, width: w, tabOrder: 1000 },
    visual: {
      visualType: 'slicer',
      query: { queryState: { Values: { projections: [colExpr(entity, column)] } } },
      objects: {
        data: [{ properties: { mode: lit("'Dropdown'") } }],
        header: [{ properties: { show: lit('true'), text: lit(`'${headerText}'`) } }]
      },
      visualContainerObjects: {
        padding: [{ properties: { top: lit('8D'), bottom: lit('8D'), left: lit('8D'), right: lit('8D') } }]
      }
    }
  };
}

function basicSlicer(entity, column, headerText, x, y, w, h, searchBox) {
  return {
    $schema: VC_SCHEMA,
    name: hexId(),
    position: { x, y, z: 1000, height: h, width: w, tabOrder: 1000 },
    visual: {
      visualType: 'slicer',
      query: { queryState: { Values: { projections: [colExpr(entity, column)] } } },
      objects: {
        data: [{ properties: { mode: lit("'Basic'") } }],
        header: [{ properties: { show: lit('true'), text: lit(`'${headerText}'`) } }]
      },
      visualContainerObjects: {
        padding: [{ properties: { top: lit('8D'), bottom: lit('8D'), left: lit('8D'), right: lit('8D') } }]
      }
    }
  };
}

function betweenSlicer(entity, column, headerText, x, y, w, h) {
  return {
    $schema: VC_SCHEMA,
    name: hexId(),
    position: { x, y, z: 1000, height: h, width: w, tabOrder: 1000 },
    visual: {
      visualType: 'slicer',
      query: { queryState: { Values: { projections: [colExpr(entity, column)] } } },
      objects: {
        data: [{ properties: { mode: lit("'Between'") } }],
        header: [{ properties: { show: lit('true'), text: lit(`'${headerText}'`) } }]
      },
      visualContainerObjects: {
        padding: [{ properties: { top: lit('8D'), bottom: lit('8D'), left: lit('8D'), right: lit('8D') } }]
      }
    }
  };
}

function exploreByTileSlicer(x, y, w, h) {
  return {
    $schema: VC_SCHEMA,
    name: hexId(),
    position: { x, y, z: 1000, height: h, width: w, tabOrder: 1000 },
    visual: {
      visualType: 'advancedSlicerVisual',
      query: { queryState: { Values: { projections: [colExpr('Explore By', 'Explore By')] } } },
      visualContainerObjects: {
        title: [{ properties: { show: lit('true'), text: lit("'Explore by'") } }],
        padding: [{ properties: { top: lit('8D'), bottom: lit('8D'), left: lit('8D'), right: lit('8D') } }]
      }
    }
  };
}

const EXPLORE_FIELDS = ['Genre', 'Metacritic Bucket', 'ESRB Group', 'Duration Bucket'];
function exploreByFieldParamArray() {
  return [{
    parameterExpr: { Column: { Expression: { SourceRef: { Entity: 'Explore By' } }, Property: 'Explore By' } },
    index: 0,
    length: 1
  }];
}
function exploreByProjections() {
  // Field-parameter target visuals project only the currently-active field
  // (index 0 = Genre); the sibling fieldParameters array (length 4) tells
  // Desktop this projection is swappable among the parameter's 4 fields.
  return [colExpr('Games', EXPLORE_FIELDS[0])];
}

function donutExploreBy(x, y, w, h) {
  return {
    $schema: VC_SCHEMA,
    name: hexId(),
    position: { x, y, z: 1000, height: h, width: w, tabOrder: 1000 },
    visual: {
      visualType: 'donutChart',
      query: {
        queryState: {
          Category: { projections: exploreByProjections(), fieldParameters: exploreByFieldParamArray() },
          Y: { projections: [measExpr('_Measures', 'Game Count')] }
        }
      },
      objects: {
        legend: [{ properties: { show: lit('true'), position: lit("'Right'") } }],
        labels: [{ properties: { show: lit('true') } }]
      },
      visualContainerObjects: {
        title: [{ properties: { show: lit('true'), text: lit("'Catalog by selected view'") } }]
      }
    }
  };
}

function rankedBarExploreBy(x, y, w, h) {
  return {
    $schema: VC_SCHEMA,
    name: hexId(),
    position: { x, y, z: 1000, height: h, width: w, tabOrder: 1000 },
    visual: {
      visualType: 'clusteredBarChart',
      query: {
        queryState: {
          Category: { projections: exploreByProjections(), fieldParameters: exploreByFieldParamArray() },
          Y: { projections: [measExpr('_Measures', 'Game Count')] },
          Tooltips: { projections: [measExpr('_Measures', 'Avg Metacritic (Selected Plan)')] }
        },
        sortDefinition: { sort: [{ field: measExpr('_Measures', 'Game Count').field, direction: 'Descending' }], isDefaultSort: true }
      },
      objects: {
        dataPoint: [{ properties: { fill: litColor(ACCENT) } }]
      },
      visualContainerObjects: {
        title: [{ properties: { show: lit('true'), text: lit("'Ranked by games'") } }]
      }
    }
  };
}

function gameTable(x, y, w, h) {
  const cols = [
    ['Games', 'Game'], ['Games', 'Genre'], ['Games', 'Metacritic'], ['Games', 'CompletionHours'],
    ['Games', 'ESRB Group'], ['Games', 'Added']
  ];
  return {
    $schema: VC_SCHEMA,
    name: hexId(),
    position: { x, y, z: 1000, height: h, width: w, tabOrder: 1000 },
    visual: {
      visualType: 'tableEx',
      query: { queryState: { Values: { projections: cols.map(([e, c]) => colExpr(e, c)) } } },
      objects: {
        columnHeaders: [{ properties: { columnAdjustment: lit("'growToFit'"), autoSizeColumnWidth: lit('true') } }]
      }
    }
  };
}

function comboChart(x, y, w, h) {
  return {
    $schema: VC_SCHEMA,
    name: hexId(),
    position: { x, y, z: 1000, height: h, width: w, tabOrder: 1000 },
    visual: {
      visualType: 'lineClusteredColumnComboChart',
      query: {
        queryState: {
          Category: { projections: [colExpr('Date', 'Year Month')] },
          Y: { projections: [measExpr('_Measures', 'Games Added By Month'), measExpr('_Measures', 'Games Removed By Month')] },
          Y2: { projections: [measExpr('_Measures', 'Net Catalog Running Total')] }
        }
      },
      objects: {
        dataPoint: [
          { properties: { fill: litColor('#14A814') }, selector: { metadata: '_Measures.Games Added By Month' } },
          { properties: { fill: litColor('#E74C3C') }, selector: { metadata: '_Measures.Games Removed By Month' } }
        ],
        lineStyles: [{ properties: { strokeWidth: lit('3D') }, selector: { metadata: '_Measures.Net Catalog Running Total' } }],
        legend: [{ properties: { show: lit('true'), position: lit("'Top'") } }]
      },
      visualContainerObjects: {
        title: [{ properties: { show: lit('true'), text: lit("'Catalog entries, exits and net size by month'") } }]
      }
    }
  };
}

function clusteredBarCompare(x, y, w, h) {
  return {
    $schema: VC_SCHEMA,
    name: hexId(),
    position: { x, y, z: 1000, height: h, width: w, tabOrder: 1000 },
    visual: {
      visualType: 'clusteredColumnChart',
      query: {
        queryState: {
          Category: { projections: [colExpr('Plan', 'Plan')] },
          Y: { projections: [measExpr('_Measures', 'Effective Monthly Price'), measExpr('_Measures', 'Retail Cost For N Games')] }
        }
      },
      objects: {
        dataPoint: [
          { properties: { fill: litColor(ACCENT) }, selector: { metadata: '_Measures.Effective Monthly Price' } },
          { properties: { fill: litColor('#B3B3B3') }, selector: { metadata: '_Measures.Retail Cost For N Games' } }
        ],
        legend: [{ properties: { show: lit('true'), position: lit("'Top'") } }]
      },
      visualContainerObjects: {
        title: [{ properties: { show: lit('true'), text: lit("'Game Pass cost vs. buying the games yourself'") } }]
      }
    }
  };
}

function savingsGauge(x, y, w, h) {
  return {
    $schema: VC_SCHEMA,
    name: hexId(),
    position: { x, y, z: 1000, height: h, width: w, tabOrder: 1000 },
    visual: {
      visualType: 'gauge',
      query: {
        queryState: {
          Y: { projections: [measExpr('_Measures', 'Savings %')] }
        }
      },
      objects: {
        dataPoint: [{ properties: { fill: litColor(ACCENT) } }]
      },
      visualContainerObjects: {
        title: [{ properties: { show: lit('true'), text: lit("'Savings vs. buying outright'") } }]
      }
    }
  };
}

function barByPlan(x, y, w, h) {
  return {
    $schema: VC_SCHEMA,
    name: hexId(),
    position: { x, y, z: 1000, height: h, width: w, tabOrder: 1000 },
    visual: {
      visualType: 'clusteredColumnChart',
      query: {
        queryState: {
          Category: { projections: [colExpr('Plan', 'Plan')] },
          Y: { projections: [measExpr('_Measures', 'Game Count')] }
        }
      },
      objects: { dataPoint: [{ properties: { fill: litColor(ACCENT) } }] },
      visualContainerObjects: { title: [{ properties: { show: lit('true'), text: lit("'Catalog size by plan'") } }] }
    }
  };
}

// ---------- Page assembly ----------

const PAGES = [
  { key: 'home', displayName: 'Home', existingId: 'b672fd96913621730e2a' },
  { key: 'calculator', displayName: 'Calculator' },
  { key: 'catalog', displayName: 'Catalog Explorer' },
  { key: 'timeline', displayName: 'Library Timeline' },
  { key: 'plans', displayName: 'Plan Comparison' }
];
PAGES.forEach((p) => { p.id = p.existingId || hexId(24); });
const pageIdByKey = Object.fromEntries(PAGES.map((p) => [p.key, p.id]));

function headerVisuals(activeKey) {
  const navOrder = [['home', 'Home'], ['calculator', 'Calculator'], ['catalog', 'Catalog'], ['timeline', 'Timeline'], ['plans', 'Plans']];
  const visuals = [];
  visuals.push(textboxTitle(PAGES.find(p => p.key === activeKey).displayName, 32, 10, 380, 44));
  let x = 430;
  const w = 110, h = 44, gap = 12;
  for (const [key, label] of navOrder) {
    visuals.push(navButton(label, x, 10, w, h, pageIdByKey[key]));
    x += w + gap;
  }
  return visuals;
}

function writePage(p, visuals) {
  const pageDir = path.join(PAGES_DIR, p.id);
  const visualsDir = path.join(pageDir, 'visuals');
  fs.mkdirSync(visualsDir, { recursive: true });
  const page = {
    $schema: PAGE_SCHEMA,
    name: p.id,
    displayName: p.displayName,
    displayOption: 'FitToPage',
    height: 1080,
    width: 1920,
    objects: {
      background: [{ properties: { color: litColor(DARK_BG), transparency: lit('0D') } }]
    }
  };
  fs.writeFileSync(path.join(pageDir, 'page.json'), JSON.stringify(page, null, 2));
  for (const v of visuals) {
    const vDir = path.join(visualsDir, v.name);
    fs.mkdirSync(vDir, { recursive: true });
    fs.writeFileSync(path.join(vDir, 'visual.json'), JSON.stringify(v, null, 2));
  }
}

// HOME
{
  const p = PAGES.find(x => x.key === 'home');
  const visuals = [
    ...headerVisuals('home'),
    htmlContent('Home Hero HTML', 0, 64, 1600, 916),
    dropdownSlicer('Plan', 'Plan', 'Plan', 1620, 64, 280, 80),
    ctaButton("See if it's worth it", 1620, 156, 280, 52, pageIdByKey.calculator)
  ];
  writePage(p, visuals);
}

// CALCULATOR
{
  const p = PAGES.find(x => x.key === 'calculator');
  const railX = 1620, railW = 280;
  const visuals = [
    ...headerVisuals('calculator'),
    dropdownSlicer('Games Per Month', 'Games Per Month', 'Games per month', railX, 72, railW, 80),
    dropdownSlicer('Avg Hours Override', 'Avg Hours Override', 'Avg hours/game override (0 = use catalog avg)', railX, 164, railW, 80),
    dropdownSlicer('Retail Price Per Game', 'Value', 'Retail price per game ($)', railX, 256, railW, 80),
    dropdownSlicer('Monthly Price Override', 'Value', 'Monthly price override (0 = use plan default)', railX, 348, railW, 80),
    dropdownSlicer('Plan', 'Plan', 'Plan', railX, 440, railW, 80),
    htmlContent('Calculator Verdict HTML', 0, 64, 1600, 420),
    clusteredBarCompare(0, 484, 800, 596),
    savingsGauge(800, 484, 800, 596)
  ];
  writePage(p, visuals);
}

// CATALOG EXPLORER
{
  const p = PAGES.find(x => x.key === 'catalog');
  const railX = 1620, railW = 280;
  const visuals = [
    ...headerVisuals('catalog'),
    dropdownSlicer('Plan', 'Plan', 'Plan', railX, 72, railW, 80),
    dropdownSlicer('Games', 'System', 'Platform', railX, 164, railW, 80),
    dropdownSlicer('Games', 'xCloud', 'xCloud', railX, 256, railW, 80),
    basicSlicer('Games', 'Genre', 'Genre', railX, 348, railW, 288, true),
    exploreByTileSlicer(0, 64, 700, 64),
    donutExploreBy(0, 140, 640, 460),
    rankedBarExploreBy(640, 140, 960, 460),
    gameTable(0, 612, 1600, 468)
  ];
  writePage(p, visuals);
}

// LIBRARY TIMELINE
{
  const p = PAGES.find(x => x.key === 'timeline');
  const railX = 1620, railW = 280;
  const visuals = [
    ...headerVisuals('timeline'),
    betweenSlicer('Date', 'Date', 'Date range', railX, 72, railW, 104),
    dropdownSlicer('Plan', 'Plan', 'Plan', railX, 188, railW, 80),
    comboChart(0, 64, 1600, 560),
    htmlContent('Leaving Soon HTML', 0, 624, 800, 456),
    htmlContent('Recently Added HTML', 800, 624, 800, 456)
  ];
  writePage(p, visuals);
}

// PLAN COMPARISON
{
  const p = PAGES.find(x => x.key === 'plans');
  const visuals = [
    ...headerVisuals('plans'),
    htmlContent('Plan Comparison HTML', 0, 64, 1920, 760),
    barByPlan(0, 824, 1920, 256)
  ];
  writePage(p, visuals);
}

// pages.json
const pagesJson = {
  $schema: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/pagesMetadata/1.1.0/schema.json',
  pageOrder: PAGES.map(p => p.id),
  activePageName: PAGES[0].id
};
fs.writeFileSync(path.join(PAGES_DIR, 'pages.json'), JSON.stringify(pagesJson, null, 2));

console.log('Generated pages:', PAGES.map(p => `${p.key} -> ${p.id}`).join(', '));
