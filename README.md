# Xbox Game Pass Catalog Report

A Power BI report that tracks the Xbox Game Pass catalog over time — what's
been added, what's been removed, how the subscription tiers compare in price,
and whether a subscription is actually worth it versus buying games outright.

## What's in it

Five pages:

- **Home** — landing page with quick links and a subscribe call-to-action.
- **Calculator** — enter how many games you play per month and it tells you
  the cost per game/hour on each plan, and whether subscribing beats buying.
- **Catalog Explorer** — browse every game currently in the catalog (genre,
  Metacritic score, time to beat, ESRB rating, when it was added).
- **Library Timeline** — catalog size over time (net running total with a
  trend line), monthly additions/removals, a "Leaving Soon" list, and a
  "Recently Added" list.
- **Plan Comparison** — Game Pass Essential / Premium / Ultimate side by
  side: price, game count, average Metacritic score, feature breakdown.

The underlying data lives in [`data/Games.csv`](data/Games.csv) and is kept
up to date by a scheduled routine that pulls the community-maintained
[XBOX Game Pass Master List](https://docs.google.com/spreadsheets/d/1kspw-4paT-eE5-mrCrc4R9tg70lH2ZTFrJOUmOtOytg/)
spreadsheet every Monday and merges in newly added/removed titles.

## Opening it

You need [Power BI Desktop](https://www.microsoft.com/en-us/download/details.aspx?id=58494)
(free, Windows only).

1. Download or clone this repo:
   ```bash
   git clone https://github.com/renatchein/xbox-gamepass.git
   ```
   Or click **Code → Download ZIP** on GitHub and extract it.
2. Open **`XboxGamePass.pbip`** — double-click it, or open it from inside
   Power BI Desktop (File → Open). This is a Power BI Project file; Desktop
   will load the `XboxGamePass.Report` and `XboxGamePass.SemanticModel`
   folders next to it automatically.
3. The data refreshes from the local `data/Games.csv` file, so it works
   fully offline — no external connections required to view the report.

## Project structure

```
XboxGamePass.pbip                 # the project entry point — open this
XboxGamePass.Report/              # report pages, visuals, theme (PBIR format)
XboxGamePass.SemanticModel/       # tables, measures, relationships (TMDL format)
data/Games.csv                    # the game catalog data the model imports
images/                           # logos and background art used in the report
```

Both `.Report` and `.SemanticModel` are plain text/JSON, so changes show up
as readable diffs in git.
