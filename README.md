# Flight Atlas

A 3D interactive globe visualization of personal flight history, built with [Globe.gl](https://globe.gl) and vanilla JavaScript.

Displays ~244 flights (2010–2026) as animated arcs on a dark-themed globe with glassmorphism UI, airport markers, filtering, and detailed tooltips.

## Running

No build step or install required — all dependencies load via CDN.

```bash
python3 -m http.server 8742
```

Open `http://localhost:8742`.

## Features

- Animated flight arcs colored by airline
- Pulsing airport markers sized by flight count
- Country borders overlay on a high-resolution Blue Marble globe
- Hover tooltips for flights (route, date, distance) and airports (code, flight count)
- Side panel with full flight log, filterable by year and airline
- Header stats: total flights, airports, distance, airlines
- Auto-rotation with pause/resume control
- Responsive layout

## Architecture

Three files, no framework:

| File | Purpose |
|------|---------|
| `index.html` | Shell: loading screen, header, globe container, side panel, tooltip, controls |
| `styles.css` | Dark theme, glassmorphism, animations, responsive layout |
| `app.js` | All logic: CSV parsing, geocoding, Globe.gl setup, filtering, tooltips |

## Data

`itinierary.csv` — flight records with columns: `date`, `airlines`, `flight_no`, `departure_airport`, `departure_time`, `arrival_city`, `arrival_time`, `distance`. Airport names are in Chinese; geocoding is handled client-side via the `AIRPORT_COORDS` dictionary in `app.js`.

## Dependencies (CDN)

- `globe.gl@2.35.1` — 3D globe (bundles Three.js)
- `d3-dsv@3.0.1` — CSV parsing
- `world-atlas@2` — Country borders (TopoJSON, fetched at runtime)

---

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
