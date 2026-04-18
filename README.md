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

