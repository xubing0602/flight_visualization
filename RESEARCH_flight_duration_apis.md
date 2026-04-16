# Research: Retrieving Actual Flight Durations Online

> Investigation into replacing (or augmenting) the timezone-calculated `flight_duration` in `itinierary.csv` with **actual** flight durations (wheels-up → wheels-down / block times) from an online API.
>
> **Date:** 2026-04-16
> **Dataset:** 244 flights, 2010–2026

---

## Context

The Flight Atlas currently computes flight durations from `departure_time` and `arrival_time` in `itinierary.csv` using `calculate-flight-duration.py`, which handles timezone differences and DST correctly. This gives **scheduled** durations (the ticket times).

This report evaluates whether authoritative **actual** flight durations are available freely or at acceptable cost, and estimates what coverage is realistic for the 244-flight dataset.

---

## The Dataset

| Year range | Flights | % of total |
|---|---|---|
| 2010–2011 | 5 | ~2% |
| 2012–2015 | 51 | ~21% |
| 2016–2020 | 103 | ~42% |
| 2021–2026 | 85 | ~35% |
| **Total** | **244** | **100%** |

Notable: ~60% are **Chinese domestic** flights (PEK/PVG/SZX/CAN etc.), which have historically thinner ADS-B coverage than US/EU routes.

---

## API Landscape

### Tier 1 — Historical, reliable, paid

**FlightAware AeroAPI** — best historical coverage
- Coverage: January 1, 2011 → present (rules out 3 of 244 flights from 2010)
- Historical flight lookup: `GET /history/flights/{ident}` — includes actual out/off/on/in block times
- Pricing: pay-as-you-go, `$0.06 per 15-record result set`; ~`$0.004` per flight lookup
- **244 flights ≈ $1–3 in query costs**, but requires a paid plan — the free Personal tier ($5/mo credit) **does not include historical endpoints**
- Minimum paid tier: **$100/month** (Standard, commercial), cancellable month-to-month
- Estimated coverage of user data: **85–95%** (lower for obscure Chinese domestic 2010–2015 flights)

### Tier 2 — Free/cheap but short lookback window

**AeroDataBox** (via RapidAPI)
- Free/basic tier: 300–600 calls/mo (~$0.99/mo on RapidAPI)
- Paid: `$5/mo` for 3,000 calls
- **Lookback limit ranges 7–30 days depending on tier** — NOT viable for 2010–2024 flights
- Estimated coverage of user data: **~3% (only 2026 flights)**

**AviationStack**
- Free: 100 calls/mo
- Historical data is paid-only ($49.99/mo for 10,000 calls)
- Coverage back to ~2017 typical
- Estimated coverage of user data: **~70%** IF paid plan used

**FlightAPI.io / FlightLabs**
- Short trials (20–50 requests free)
- Not suitable for batch of 244

**Amadeus Self-Service**
- Free tier: 2,000 calls/mo (test env), $0.002/call production
- On-Demand Flight Status: real-time and near-future only — **no deep history**
- Estimated coverage of user data: **~5%** (only 2026 flights)

### Tier 3 — Free if you qualify, high effort

**OpenSky Network**
- REST API: only last 30 days (free, no auth)
- Trino SQL database: full historical archive from ~2013, raw ADS-B state vectors
- **Requires approval** from OpenSky (academic / research / non-commercial — personal hobby use is case-by-case)
- You'd match your flights to state-vector tracks yourself by airport/date, then compute block times from wheels-up to wheels-down
- Estimated coverage of user data: **~75%** for flights 2013+, lower for Chinese domestic (~50% due to sparse ADS-B in mainland China pre-2020)
- Effort: **high** — not a simple API call; requires data pipeline

---

## Free vs Paid Coverage Summary

For the 244 flights:

| Option | Monthly cost | One-time cost | Est. coverage | Effort |
|---|---|---|---|---|
| FlightAware AeroAPI Standard (1 month, then cancel) | $100 × 1 mo | ~$100 | **85–95%** | Low |
| AeroDataBox $5/mo | $5 ongoing | — | ~3% | Low |
| AviationStack Basic | $50 ongoing | — | ~70% | Low |
| OpenSky Trino (if approved) | $0 | — | ~75% | **High** |
| Current timezone-based calculation | $0 | — | ~95% *(scheduled, not actual)* | Done |

---

## Reality Check: How Much Better Is "Actual" vs Scheduled?

The current `flight_duration` column is computed from the **scheduled** local times on the ticket:

- **Actual block time** (out → in) typically differs from scheduled by **±5–15 minutes** due to taxi, holding, wind, etc.
- For longhaul flights, headwind/tailwind can shift duration by ±30 min, but scheduled times usually already buffer this
- Actual **airborne** time (off → on) is a better metric if you want "pure flight time", typically 10–25 min shorter than scheduled due to taxi

So an actual-duration dataset would give you:
1. More precise block time (usually within 15 min of current values)
2. Taxi-in/out breakdown
3. Delay tracking (departure/arrival delays)
4. Ability to compute statistics like "airline on-time rate"

But it would **not dramatically change** any of the existing analytics charts — the distribution/histogram/scatter would look nearly identical.

---

## Coverage Risks Specific to This Dataset

Flights most likely to be **missing** from any API:
- Pre-2011 (3 flights in 2010) — outside AeroAPI's window
- Small Chinese regional carriers pre-2015 (e.g. 海航 HU on obscure routes)
- Domestic China flights 2010–2013 (sparse ADS-B, limited airline APIs)
- Defunct airlines (港龙 KA merged 2020, 捷特 9W ceased 2019) — usually still in archives

Estimate: **10–20 flights (~5–8%)** will have no authoritative actual-duration data regardless of which API is used.

---

## Options Going Forward

### Option A: One-time FlightAware AeroAPI batch, ~$100
1. Subscribe to AeroAPI Standard ($100) for one month
2. Write a Node/Python script that hits `/history/flights/{ident}` for each of the 244 flights (ident = IATA flight number, plus `ident_date`)
3. Parse `actual_off` / `actual_on` to compute actual airborne duration
4. Merge into `itinierary.csv` as new columns: `actual_duration_hours`, `actual_duration_minutes`, `departure_delay_minutes`, `arrival_delay_minutes`
5. Cancel subscription after data is saved
6. Update UI to show both scheduled vs actual, with delay highlight

### Option B: Keep current calculated durations (recommended)
- The timezone-calculated durations are already very close to actual (within 5–15 min)
- Saves ~$100 and scripting effort
- Good enough for visualizations and charts

### Option C: Hybrid — small free tier for new flights only
- Use FlightAware Personal free tier ($5/mo credit) only for *future* flights going forward
- Leave historical data as timezone-calculated
- Requires a cron/periodic script

---

## Recommendation

**Option B (keep current calculated durations).** The ~5–15 min difference vs actual block time is not visually meaningful in any of the current analytics charts, and the 244-flight batch lookup has meaningful edge-case risk (coverage gaps on old Chinese domestic flights). If you ever want to add **delay analytics** (a genuinely new feature), then Option A becomes justified.

---

## Sources

- [AeroAPI | Flight status & tracking data API | FlightAware](https://www.flightaware.com/commercial/aeroapi/)
- [AeroAPI Historical Flight Data](https://go.flightaware.com/aeroapi-historical-flight-data)
- [API Pricing – AeroDataBox](https://aerodatabox.com/pricing/)
- [AeroDataBox on RapidAPI](https://rapidapi.com/aedbx-aedbx/api/aerodatabox/pricing)
- [Aviationstack Pricing](https://aviationstack.com/pricing)
- [OpenSky Network Data](https://opensky-network.org/data)
- [OpenSky REST API docs](https://openskynetwork.github.io/opensky-api/rest.html)
- [OpenSky Trino Historical Data](https://openskynetwork.github.io/opensky-api/trino.html)
- [Amadeus On-Demand Flight Status API](https://developers.amadeus.com/self-service/category/flights/api-doc/on-demand-flight-status)
- [FlightAPI.io](https://www.flightapi.io/)
- [FlightLabs](https://www.goflightlabs.com/)
