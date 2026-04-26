
## Changelog

### 2026-04-15 — Visual & UX Improvements

1. **Pause/Resume Rotation** — Added a toggle button (bottom-right, next to the flight log button) that pauses globe auto-rotation. When paused, the idle timer will not auto-resume spinning. Icon switches between pause and play.

2. **Separate Arcs for Duplicate Routes** — Flights on the same route (e.g. PEK↔HND) now fan out at different altitudes instead of stacking on top of each other. Each flight is assigned a route index, and arc altitude increases by 0.04 per duplicate.

3. **High-Res Globe + Country Borders** — Replaced the night earth texture with NASA Blue Marble for sharper detail when zoomed in. Added a country borders overlay using `polygonsData` with TopoJSON from `world-atlas`, rendered as subtle cyan outlines with transparent fill.

4. **Fixed Airport Tooltip Bug** — `showPointTooltip()` referenced `point.code` but point objects only had a `key` field. Added `code: p.key` to the objects created in `buildPoints()` so tooltips now correctly display the IATA code (e.g. "PEK · 30 flights").

5. **Pulsing Airport Markers** — Replaced the plain 3D cylindrical bars with HTML-based markers using `htmlElementsData`. Each airport shows a glowing dot with concentric rings that pulse outward (radar-ping effect), sized by flight count. Tooltips trigger on hover over the marker element.

### 2026-04-15 — Filters & Airport Marker Redesign

1. **Heat-Map Airport Markers** — Replaced pulsing ring markers with heat-colored glowing dots. Color gradient goes from cyan (few flights) to red (many flights) so frequency is immediately visible. Removed overlapping IATA code labels. Markers sit as HTML elements above the 3D canvas for reliable hovering even near dense routes.

2. **Multi-Select Filters** — All filters now support multiple simultaneous selections via checkbox dropdowns instead of single-select native dropdowns. Each filter shows "All", "N selected", or the selected values.

3. **Airport Filter** — Added a new airport filter. Select one or more airports to show only flights that depart from or arrive at those airports.

4. **Region-Grouped Filters** — Airlines and airports in the filter dropdowns are organized by geographic region (China, Japan, South Korea, Southeast Asia, South Asia, Middle East, Europe, North America, Australia) then alphabetically within each group.

5. **Header Stats Visibility** — Fixed side panel (z-index 200) overlapping header stats. Header now renders above the panel (z-index 250) so stats remain visible when the flight log is open.

### 2026-04-16 — Analytics Dashboard

1. **Analytics Overlay** — Added a full-screen analytics dashboard accessible via the bar-chart button (bottom-right). Opens as a blurred overlay on top of the globe with smooth fade transitions. Closes with the X button or Escape key.

2. **Summary Metrics** — Five metric cards at the top: Earth circumnavigations (total distance / 40,075 km), average flight distance, longest single flight, busiest year, and regions covered.

3. **Flights & Distance by Year** (combo bar + line) — Bar chart for annual flight count with an overlaid line chart showing total distance per year. Dual Y-axes for flights and kilometers.

4. **Top 15 Airports** (horizontal bar) — Most-visited airports ranked by total appearances (departures + arrivals), with IATA code and city name labels.

5. **Region Distribution** (doughnut) — Geographic spread of flights across 9 regions with percentage tooltips.

6. **Top Airlines by Flights** (horizontal bar) — Most-flown carriers ranked by flight count, colored with each airline's brand color.

7. **Top Airlines by Distance** (horizontal bar) — Carriers ranked by total kilometers flown, also using brand colors.

8. **Monthly Flight Pattern** (radar) — Seasonal flying patterns across 12 months, showing both flight count and distance.

9. **Day of Week Distribution** (polar area) — Which days of the week have the most flights.

10. **Top Routes** (horizontal bar) — Most frequently flown city-pair routes with a cyan-to-blue gradient.

11. **New dependency** — Added `chart.js@4.4.7` via CDN for all chart rendering. New file `analytics.js` contains all dashboard logic.

### 2026-04-16 — Airline Logos

1. **Airline Logos in Flight Log** — Each flight card now displays the airline's logo in a rounded tinted container on the left. The IATA code is parsed from the flight number (e.g. `JL25` → `JL`), and the logo is loaded from `logos/<IATA>.png`.

2. **Airline Logos in Tooltips** — Flight arc tooltips now show the airline logo next to the route, making airline identification instant on hover.

3. **Local Logo Assets** — All 40 airline logos are stored locally in `logos/`, originally sourced from [logo.dev](https://logo.dev) keyed by official airline domain (e.g. `sda.cn` → Shandong Airlines `SC.png`). This eliminates runtime CDN dependency and avoids third-party logo APIs that require paid subscriptions.

4. **`download-logos.sh`** — Reproducible download script that maps each IATA code to its canonical airline domain and fetches a 200px PNG from logo.dev. Idempotent: re-running skips already-downloaded files. Token can be overridden via `LOGO_DEV_TOKEN` env var.

5. **Graceful Fallback** — If an image fails to load, the `onerror` handler swaps in a text badge with the airline's IATA code in its brand color.

6. **Sidebar Repositioned** — Moved the flight log side panel from right to left edge of the screen. The panel toggle button is now at bottom-left, while analytics and rotation controls remain at bottom-right.

### 2026-04-16 — Flight Duration Analytics

1. **Calculate Flight Duration Script** — Added `calculate-flight-duration.py` that computes actual flight time accounting for timezone differences (using `timezonefinder` and Python's `zoneinfo`), DST transitions, and date rollovers (+1 or +2 days). Updates `itinierary.csv` in place with three new columns: `flight_duration` (human-readable), `flight_duration_hours`, and `flight_duration_minutes`.

2. **Duration in Flight Log** — Each flight card now displays duration (e.g., "⏱ 3 hours 25 minutes") in cyan monospace font after the distance.

3. **Duration in Tooltips** — Arc hover tooltips show flight duration alongside departure/arrival times.

4. **New Analytics Metric** — Summary metrics row now includes "Avg Flight Duration" card showing average across all flights with duration data.

5. **Avg Duration by Airline Chart** — Horizontal bar chart ranking airlines by average flight duration (shows which carriers you fly longer/shorter routes with).

6. **Flight Duration Distribution Histogram** — Bar chart showing frequency distribution in 1-hour buckets (0-1h, 1-2h, ..., 15+h) to visualize typical flight lengths.

7. **Distance vs Duration Scatter Plot** — Full-width scatter chart plotting distance (x-axis) vs actual flight time (y-axis). Reveals flight efficiency — points below the trend line are faster-than-average for their distance, useful for spotting direct vs connecting flights or tailwind effects.

### 2026-04-18 — Header Stats & Hint Polish

1. **Flight Duration in Header Stats** — Added a new top-right stat pill (`Flight Duration`) next to `Distance`, showing total flight time in the format `xxx hr xx min`.

2. **Duration Aggregation Logic** — `updateStats()` now sums total duration from `flight_duration_hours` and `flight_duration_minutes`, with backward-compatible fallback parsing of legacy `flight_duration` text (`x hours xx minutes`).

3. **Distance Thousand Separators** — Updated the `Distance` stat display to use thousand separators (e.g., `637,126 km`) for better readability.

4. **Centered Controls Hint** — Fixed bottom `controls-hint` appearing slightly right-shifted by introducing a dedicated centered fade-in animation that preserves `translateX(-50%)`.

### 2026-04-26 — Responsive Design Overhaul

1. **Mobile Bottom-Sheet Flight Log** — On mobile (≤ 767px) the side panel becomes a full-height bottom sheet (`border-radius: 20px 20px 0 0`, `max-height: 80dvh`) that slides up from the bottom. It starts fully hidden (no peek) since the dedicated flight log button makes the entry point discoverable. The desktop left-slide behaviour (`translateX`) is overridden on mobile in favour of `translateY`. A semi-transparent backdrop overlay (`#mobileOverlay`, `z-index: 150`) appears behind the open panel; tapping it closes the panel.

2. **3 FABs Aligned on One Row** — Flight log, pause/rotation, and analytics buttons are all pinned to `bottom: 20px` on mobile with `left: 20px / 76px / 132px` (56px spacing = button width + gap), guaranteeing they share the same baseline.

3. **Header Stat Grid** — On mobile the five stat pills switch from a horizontal scroll strip to a `grid-template-columns: repeat(3, 1fr)` layout (2 rows of 3 + 2), so all stats are immediately visible without swiping. Pills use `min-width: 0` to prevent grid overflow, `white-space: normal` on values to allow wrapping, and reduced font sizes (`11px` value / `7px` label).

4. **Compact Header Layout** — On mobile the header stacks vertically (`flex-direction: column`), the tagline subtitle is hidden, and the stat grid sits directly below the logo with `gap: 8px`. Padding reduced to `12px 16px`.

5. **Tablet Breakpoint** — Added a `768px–1023px` tablet rule that narrows the side panel to `300px`. Analytics grid drops to single-column at `≤ 1023px` (previously `1024px`).

6. **Analytics Mobile Layout** — Analytics overlay keeps full-screen treatment on mobile: 2-column metrics grid, single-column chart grid, `chart-wide` cards lose their span, smaller title and metric font sizes, tighter container padding (`20px 14px 60px`).

7. **Touch Targets** — `.ms-option` (filter checkboxes) and `.flight-card` items enforce `min-height: 40px / 52px` on mobile for comfortable tapping.

#### Files Modified

| File | Change |
|------|--------|
| `styles.css` | Replaced single `768px` breakpoint with tablet (`768–1023px`) + mobile (`≤767px`) blocks; added `.mobile-handle`, `#mobileOverlay`, FAB alignment, stat grid, analytics mobile rules |
| `app.js` | Added `isMobile()` / `setMobileOverlay()` helpers; mobile-aware panel toggle (uses `mobile-open` class + `translateY` instead of `open` + `translateX`); mobile overlay click listener |
| `index.html` | Added `<div class="mobile-handle">` inside side panel; added `<div id="mobileOverlay">` before scripts |
