# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-page 3D flight history visualization using Globe.gl. Displays ~244 personal flights (2010–2026) as animated arcs on an interactive dark-themed globe with glassmorphism UI.

## Running

Serve locally with any static file server:
```bash
python3 -m http.server 8742
```
Then open `http://localhost:8742`. No build step or dependencies to install — all libraries load via CDN.

## Architecture

**Pure vanilla JS, no framework or build system.** Four files:

- `index.html` — Shell with loading screen, header stats, globe container, side panel, analytics overlay, tooltip
- `styles.css` — Dark theme, glassmorphism effects, responsive layout, analytics dashboard styles
- `app.js` — Core application logic:
- `analytics.js` — Analytics dashboard with Chart.js charts (8 chart types, 5 summary metrics)
  - `AIRPORT_COORDS` — Geocoding dictionary mapping Chinese airport names → `{lat, lng, city, code}` for 73 airports
  - `AIRLINE_COLORS` — Brand color mapping for 40+ airlines
  - `parseCSV()` — Uses d3-dsv to parse `itinierary.csv`, resolves coordinates via `AIRPORT_COORDS`
  - `Globe()` from globe.gl — Mounted to DOM first, then configured with arcs, points, labels
  - Filtering by year/airline updates `arcsData`, `pointsData`, and `labelsData` on the globe instance

## Data

`itinierary.csv` — Flight records with columns: `date`, `airlines`, `flight_no`, `departure_airport`, `departure_time`, `arrival_city`, `arrival_time`, `distance`. Airport names are in Chinese. All geocoding is handled client-side via the `AIRPORT_COORDS` lookup table in `app.js`.

## Key Dependencies (CDN)

- `globe.gl@2.35.1` — 3D globe visualization (bundles Three.js internally)
- `d3-dsv@3.0.1` — CSV parsing

## Notes

- Globe.gl bundles its own Three.js — do NOT load a separate Three.js script or reference the global `THREE`
- `Globe()` returns a callable: must use `Globe()(domElement)` then chain config methods — do NOT place the DOM element call at the end of the chain
