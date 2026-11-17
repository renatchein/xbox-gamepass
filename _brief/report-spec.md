# Report Spec

## Report identity
- Report name: Xbox Game Pass — Is It Worth It?
- Semantic model: XboxGamePass (new, to be created)
- Audience: Enthusiasts / prospective subscribers (external, persuasion-oriented)
- Primary purpose: Convince a visitor to subscribe by proving cost-benefit (price vs. playtime vs. per-game value) and letting them explore the catalog by category/score/age-rating/duration
- Delivery target: Local PBIP first

## Semantic model binding
- Entry mode: Local Model (created fresh — no existing model/PBIP in the target folder; built via direct TMDL authoring, no live modeling MCP connection needed for this local build)
- Model name: XboxGamePass
- connectionString: Local Model — byPath ../XboxGamePass.SemanticModel

## User decisions and constraints
- Scope: Full first build — hero/landing, interactive cost-benefit calculator, catalog explorer (genre/score/age/duration donuts), library timeline (entries/exits by month), plan comparison
- Page count: 5
- Interactivity:
  - Navigation: custom Xbox-style pill nav buttons (not default page navigator), consistent across pages
  - Field parameter "Explore by" driving the donut (Genre / Metacritic bucket / ESRB age rating / Duration bucket)
  - Field parameter "Plan" (Game Pass Ultimate / Premium / Essential) driving catalog size + price everywhere
  - What-if parameters: Games played per month (1–30), Avg hours per game (editable override, defaults from data), Retail price per game (editable, default $59.99 — user-adjustable, not asserted as fact)
  - What-if parameters: Monthly price per plan (Ultimate/Premium/Essential) — editable since current live pricing isn't in the source data and must stay user-verifiable
  - Buttons: "See if it's worth it" (Home → Calculator), plan pill buttons (bookmark-driven), back buttons
- Design direction: Dark, Xbox-site look (near-black canvas, Xbox green #107C10 accent, large bold headlines, rounded game-tile cards), signature move = full-bleed custom HTML/SVG components (DAX-assembled, like the reference "World of Peaches" technique) for hero/KPI/calculator cards, native visuals for charts/tables/slicers
- Publishing: None for now — local PBIP only
- Tooling: Direct TMDL + PBIR authoring (powerbi-report-cli authoring mode), Power BI Desktop preview/screenshot validation, Node generator if available
- Model edit permissions: Full — new model being created for this report
- Accessibility: WCAG AA contrast on dark theme, alt text on every chart, searchable slicers for Genre (high cardinality)
- Data caveats: No real-time pricing in the source sheet → price/retail-value parameters are editable placeholders, clearly labeled "adjust to your current price" in the UI, not stated as fact. ESRB rating only exists in the "Master List" tab and is matched into the catalog by game name (some titles may be unmatched → bucketed "Not Rated").

## Narrative
- Core story: "You're paying $X/month. Here's what you actually get for it — and whether it beats buying games yourself."
- Audience promise: In under a minute, see your personal cost-per-game and cost-per-hour, browse what's in the catalog that matches your taste, and judge if canceling/joining makes sense.
- Key questions answered:
  1. How many games are in the catalog right now, and how good are they (Metacritic)?
  2. For *my* play habits (games/month), what does Game Pass cost per game and per hour vs. buying outright?
  3. What's actually in it for me — by genre, score, age rating, how long games take to beat?
  4. Is the catalog growing or shrinking, and what's leaving soon that I should play now?
  5. Which plan (Ultimate/Premium/Essential) fits me?

## Design identity (from the `design` mode, conservative canonical defaults)
- Tone: Modern Tech / Product Marketing (dark, high-contrast, brand-forward — Xbox's own site)
- Signature: Full-bleed DAX-assembled HTML/SVG hero + KPI cards with hover "why it matters" reveals, Xbox green as the single accent against near-black
- Brownfield delta: n/a (greenfield)

## Page plan (conservative layout defaults; canvas 1920×1080)

1. **Home** — Narrative Story (landing)
   - Purpose: Hook + headline value prop + top-line KPIs + plan picker + CTA into the calculator
   - Visuals: full-bleed custom HTML hero (title, subtitle, background art) with embedded KPI strip as a **composite** component (total games, avg Metacritic, avg hours/game, catalog freshness) — not a bare single-value card; plan pill buttons (bookmark actions); "See if it's worth it" CTA button
   - Fields/measures: `Total Games`, `Avg Metacritic`, `Avg Hours Per Game`, `Games Added Last 90 Days`
   - Slicers/interactions: Plan field-parameter pills (bookmark-driven), CTA button → bookmark/page nav to Calculator

2. **Cost-Benefit Calculator** — Analytical Canvas
   - Purpose: Let the user plug in their habits and get a verdict
   - Visuals: slicers panel (Games/month, Avg hours override, Retail price override, Plan, Monthly price per plan — all what-if parameters), custom HTML "verdict" card (composite: cost/game, cost/hour, % saved vs. retail, pass/fail verdict badge), clustered bar comparing "Game Pass monthly cost" vs "cost of buying N games individually", gauge/KPI for % savings
   - Fields/measures: `Selected Plan Price`, `Cost Per Game`, `Cost Per Hour`, `Retail Cost For N Games`, `Savings %`, `Verdict Text`
   - Slicers/interactions: what-if parameter sliders in top-right filter rail; plan field parameter

3. **Catalog Explorer** — Analytical Canvas
   - Purpose: Browse the catalog by the angle that matters to the visitor
   - Visuals: donut chart bound to "Explore by" field parameter (Genre / Metacritic bucket / ESRB age rating / Duration bucket), ranked horizontal bar of top genres/segments, searchable game table (name, genre, Metacritic, hours to beat, ESRB, added date) near the bottom
   - Fields/measures: `Game Count`, `Avg Metacritic`, `Avg Hours Per Game` by selected dimension
   - Slicers/interactions: "Explore by" field parameter (pill/dropdown), Plan + Platform + xCloud slicers in top-right filter rail, search slicer on Genre (high cardinality)

4. **Library Timeline** — Operational Monitor
   - Purpose: Show catalog momentum (entries/exits) to create urgency ("leaving soon — play it now")
   - Visuals: area/line combo chart of games added vs. removed per month, running net-catalog-size line, "Leaving Soon" callout list (custom HTML card list of titles leaving within 30 days), "Recently Added" callout list
   - Fields/measures: `Games Added By Month`, `Games Removed By Month`, `Net Catalog Running Total`, `Leaving Soon Flag`
   - Slicers/interactions: date range slicer (top-right), Plan field parameter carried over

5. **Plan Comparison** — Comparative Benchmark
   - Purpose: Classic "which plan" pricing-page feel, mirroring xbox.com's comparison table
   - Visuals: three-column custom HTML comparison cards (Essential/Premium/Ultimate: price input, catalog size, avg Metacritic, EA Play included?, cloud play included?, day-one titles included?), small bar comparing catalog size per plan
   - Fields/measures: `Game Count by Plan`, `Avg Metacritic by Plan`, `Monthly Price by Plan`
   - Slicers/interactions: none required (static comparison); CTA buttons back to Calculator per plan

## Design system summary
- Theme name + base palette: "Game Pass Dark" — background `#0C0C0C`/`#151515`, surface `#1A1A1A`, Xbox green accent `#107C10` (hover `#14A814`), text `#FFFFFF`/`#B3B3B3`
- Color semantics: green = positive/savings/active/included; red `#E74C3C` = negative/leaving/excluded; green also = primary CTA
- Typography pairing: Display — "Segoe UI Variable Display" / fallback "Segoe UI", bold, large tracking; Body — "Segoe UI" / system-ui
- Layout pattern: 1920×1080 canvas, 24px gutter, dark full-bleed hero modules, native visuals formatted to match via theme JSON (so no per-visual manual styling)
- Accessibility commitments: WCAG AA text contrast on dark backgrounds, alt text per chart, searchable Genre slicer, no red/green-only encoding without text labels

## Model requirements
- Existing measures: none (new model)
- New measures (indicative, finalized during build):
  `Total Games`, `Avg Metacritic`, `Avg Hours Per Game`, `Games Added Last 90 Days`,
  `Selected Plan Price`, `Cost Per Game`, `Cost Per Hour`, `Retail Cost For N Games`, `Savings %`, `Verdict Text`,
  `Game Count (by Explore-by dimension)`, `Games Added By Month`, `Games Removed By Month`, `Net Catalog Running Total`,
  `Game Count by Plan`, `Avg Metacritic by Plan`
- New calculated columns: `Added Month`, `Removed Month`, `Duration Bucket` (from Completion hours), `Metacritic Bucket`, `ESRB Group`, `Is Leaving Soon` (Removed within 30 days of refresh), `Is EA Play`
- Relationship/sort requirements: `Date` calendar table (Year/Month, month-number sort column) relating to both `Added Month` and `Removed Month` via role-playing (two inactive relationships + `USERELATIONSHIP`, or two separate date columns against one calendar using treat-as/active pattern)
- Data source: "Tiers" tab (grain, PC/Premium/Essential flags, Metacritic, Completion hours, Added/Removed/Months) merged by game name with ESRB + ESRB descriptors from "Master List" tab; "EA Play" tab as a small lookup for the `Is EA Play` flag. Extracted from the user's Google Sheet ("XBOX Game Pass Master List") into local CSV(s) under the project folder, loaded via Power Query — same pattern as the reference project's CSV-based sources.

## Canonical design contract

```yaml
Design Brief:
  generated_by: powerbi-report-cli
  contract_version: "1.0"
  canvas_default:
    width: 1920
    height: 1080
  theme:
    name: "Game Pass Dark"
    background: "#0C0C0C"
    surface: "#1A1A1A"
    accent: "#107C10"
    accent_hover: "#14A814"
    text_primary: "#FFFFFF"
    text_secondary: "#B3B3B3"
    negative: "#E74C3C"
  pages:
    - name: "Home"
      archetype: "Narrative Story"
      layout_contract:
        canvas: { width: 1920, height: 1080 }
        grid:
          regions:
            - { id: "header", x: 0, y: 0, w: 1920, h: 64 }
            - { id: "nav", x: 0, y: 64, w: 1920, h: 56 }
            - { id: "hero_composite", x: 0, y: 120, w: 1920, h: 860 }
            - { id: "footer_cta", x: 0, y: 980, w: 1920, h: 100 }
        placements:
          - { region: "header", visual: "textbox", role: "page_title", text: "Xbox Game Pass — Is It Worth It?" }
          - { region: "nav", visual: "button_group", role: "primary_nav", items: ["Home","Calculator","Catalog","Timeline","Plans"] }
          - { region: "hero_composite", visual: "html_content", role: "composite_kpi_hero", content: "Full-bleed hero art + headline + composite KPI strip (Total Games, Avg Metacritic, Avg Hours/Game, Freshness) + plan pills — not a bare single-value card" }
          - { region: "footer_cta", visual: "button", role: "cta", text: "See if it's worth it", action: "bookmark:go_calculator" }
        space_audit:
          unplaced_regions: []
          balance_rationale: "Single full-bleed narrative module by design (landing page); header+nav+footer bands frame it, no dead margins at 1920x1080."
    - name: "Calculator"
      archetype: "Analytical Canvas"
      layout_contract:
        canvas: { width: 1920, height: 1080 }
        grid:
          regions:
            - { id: "header", x: 0, y: 0, w: 1600, h: 64 }
            - { id: "filters", x: 1600, y: 0, w: 320, h: 1080 }
            - { id: "verdict_composite", x: 0, y: 64, w: 1600, h: 420 }
            - { id: "compare_chart", x: 0, y: 484, w: 800, h: 596 }
            - { id: "savings_gauge", x: 800, y: 484, w: 800, h: 596 }
        placements:
          - { region: "header", visual: "textbox", role: "page_title", text: "Cost-Benefit Calculator" }
          - { region: "filters", visual: "slicer_group", role: "whatif_inputs", items: ["Games per month","Avg hours per game","Retail price per game","Plan","Monthly price by plan"] }
          - { region: "verdict_composite", visual: "html_content", role: "composite_kpi", content: "Cost/Game, Cost/Hour, Savings %, pass/fail verdict badge — composite KPI treatment with rationale text" }
          - { region: "compare_chart", visual: "clusteredBarChart", role: "cost_comparison", fields: ["Selected Plan Price","Retail Cost For N Games"] }
          - { region: "savings_gauge", visual: "gaugeChart", role: "savings_gauge", fields: ["Savings %"] }
        space_audit:
          unplaced_regions: []
          balance_rationale: "Right-rail filters per convention; verdict band dominant above two equal analysis panels below, no gaps at 1920x1080."
    - name: "Catalog Explorer"
      archetype: "Analytical Canvas"
      layout_contract:
        canvas: { width: 1920, height: 1080 }
        grid:
          regions:
            - { id: "header", x: 0, y: 0, w: 1600, h: 64 }
            - { id: "filters", x: 1600, y: 0, w: 320, h: 1080 }
            - { id: "donut", x: 0, y: 64, w: 640, h: 480 }
            - { id: "ranked_bar", x: 640, y: 64, w: 960, h: 480 }
            - { id: "game_table", x: 0, y: 544, w: 1600, h: 536 }
        placements:
          - { region: "header", visual: "textbox", role: "page_title", text: "Catalog Explorer" }
          - { region: "filters", visual: "slicer_group", role: "catalog_filters", items: ["Plan","Platform","xCloud","Genre (search)"] }
          - { region: "donut", visual: "donutChart", role: "explore_by_donut", fields: ["Explore by (field parameter)","Game Count"] }
          - { region: "ranked_bar", visual: "barChart", role: "ranked_segments", fields: ["Explore by (field parameter)","Game Count","Avg Metacritic"] }
          - { region: "game_table", visual: "tableEx", role: "game_list", fields: ["Game","Genre","Metacritic","Hours to Beat","ESRB","Added"] }
        space_audit:
          unplaced_regions: []
          balance_rationale: "Detailed table placed at the bottom per convention; donut+bar fill the upper analytical band evenly."
    - name: "Library Timeline"
      archetype: "Operational Monitor"
      layout_contract:
        canvas: { width: 1920, height: 1080 }
        grid:
          regions:
            - { id: "header", x: 0, y: 0, w: 1600, h: 64 }
            - { id: "filters", x: 1600, y: 0, w: 320, h: 1080 }
            - { id: "flow_chart", x: 0, y: 64, w: 1600, h: 560 }
            - { id: "leaving_soon", x: 0, y: 624, w: 800, h: 456 }
            - { id: "recently_added", x: 800, y: 624, w: 800, h: 456 }
        placements:
          - { region: "header", visual: "textbox", role: "page_title", text: "Library Timeline" }
          - { region: "filters", visual: "slicer_group", role: "date_filters", items: ["Date range","Plan"] }
          - { region: "flow_chart", visual: "lineClusteredColumnComboChart", role: "entries_exits", fields: ["Added Month/Removed Month","Games Added By Month","Games Removed By Month","Net Catalog Running Total"] }
          - { region: "leaving_soon", visual: "html_content", role: "leaving_soon_list", content: "Composite card list of titles leaving within 30 days" }
          - { region: "recently_added", visual: "html_content", role: "recently_added_list", content: "Composite card list of titles added in last 30 days" }
        space_audit:
          unplaced_regions: []
          balance_rationale: "Combo chart dominant on top band; two equal-width callout lists balance the lower band."
    - name: "Plan Comparison"
      archetype: "Comparative Benchmark"
      layout_contract:
        canvas: { width: 1920, height: 1080 }
        grid:
          regions:
            - { id: "header", x: 0, y: 0, w: 1920, h: 64 }
            - { id: "plan_cards", x: 0, y: 64, w: 1920, h: 760 }
            - { id: "size_bar", x: 0, y: 824, w: 1920, h: 256 }
        placements:
          - { region: "header", visual: "textbox", role: "page_title", text: "Plan Comparison" }
          - { region: "plan_cards", visual: "html_content", role: "composite_comparison", content: "Three-column composite comparison cards (Essential/Premium/Ultimate): price, catalog size, avg Metacritic, EA Play, cloud, day-one — CTA button per card" }
          - { region: "size_bar", visual: "barChart", role: "catalog_size_by_plan", fields: ["Plan","Game Count by Plan"] }
        space_audit:
          unplaced_regions: []
          balance_rationale: "No slicers needed on a static comparison page; comparison band dominant, size chart anchors the bottom."
```

## Implementation notes

- Model changes: Create `XboxGamePass.SemanticModel` via TMDL — `Games` table (merged Tiers+ESRB+EA Play extract), `Date` calendar table, `Plan` field parameter, what-if parameter tables (Games/month, Avg hours override, Retail price, Monthly price × 3 plans), `_Measures` table.
- PBIR/report authoring: Scaffold `XboxGamePass.Report` PBIP, 5 pages per the contract above, custom HTML/SVG components authored as DAX-assembled strings rendered via an HTML content visual (same technique as the reference project), native visuals for charts/slicers/tables, "Game Pass Dark" theme JSON.
- Validation: JSON/PBIR validation after each page; DAX spot-checks for new measures.
- Desktop screenshot verification: Open/reload in Power BI Desktop, screenshot every page, fix layout/contrast/binding issues.
- Publishing boundary: Local only — no Fabric publish unless requested later.
- Risks: Live, current Game Pass pricing isn't in the source sheet — handled via clearly-labeled editable what-if parameters rather than asserted facts. ESRB match-by-name may leave a few titles unrated. HTML-content visual rendering inside Power BI Desktop needs verification (custom visual or native HTML text support) during authoring.
