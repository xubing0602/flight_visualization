/* ============================================
   FLIGHT ATLAS — Analytics Dashboard
   ============================================ */

(function () {
  // Chart.js global defaults for dark theme
  Chart.defaults.color = '#8888a0';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
  Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
  Chart.defaults.plugins.legend.labels.padding = 16;
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(16, 16, 28, 0.95)';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.titleFont = { weight: '600', size: 12 };
  Chart.defaults.plugins.tooltip.bodyFont = { size: 11 };
  Chart.defaults.plugins.tooltip.displayColors = true;
  Chart.defaults.plugins.tooltip.boxPadding = 4;

  const CYAN = '#00d4ff';
  const BLUE = '#4f8fff';
  const PURPLE = '#a855f7';
  const GOLD = '#f5a623';
  const PINK = '#ec4899';
  const GREEN = '#10b981';
  const RED = '#ef4444';
  const ORANGE = '#f97316';

  const CHART_PALETTE = [CYAN, BLUE, PURPLE, GOLD, PINK, GREEN, RED, ORANGE,
    '#06b6d4', '#8b5cf6', '#f59e0b', '#14b8a6', '#e879f9', '#fb923c', '#38bdf8', '#a3e635'];

  let chartInstances = [];

  function destroyCharts() {
    chartInstances.forEach(c => c.destroy());
    chartInstances = [];
  }

  function buildAnalytics(flights) {
    destroyCharts();

    // ---- Compute Metrics ----
    const totalDist = flights.reduce((s, f) => s + (parseInt(f.distance) || 0), 0);
    const earthCircumference = 40075;
    const laps = (totalDist / earthCircumference).toFixed(1);
    const avgDist = Math.round(totalDist / flights.length);
    const longest = flights.reduce((max, f) => {
      const d = parseInt(f.distance) || 0;
      return d > (parseInt(max.distance) || 0) ? f : max;
    }, flights[0]);
    const longestDist = parseInt(longest.distance) || 0;

    // Busiest year
    const yearCounts = {};
    flights.forEach(f => {
      const y = f.date.split('/')[0];
      yearCounts[y] = (yearCounts[y] || 0) + 1;
    });
    const busiestYear = Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0];

    // Regions
    const regions = new Set();
    flights.forEach(f => {
      for (const [region, codes] of Object.entries(AIRPORT_REGIONS)) {
        if (codes.includes(f.depCode) || codes.includes(f.arrCode)) regions.add(region);
      }
    });

    document.getElementById('metric-earth-laps').textContent = laps + 'x';
    document.getElementById('metric-avg-dist').textContent = avgDist.toLocaleString() + ' km';
    document.getElementById('metric-longest').textContent = longestDist.toLocaleString() + ' km';
    document.getElementById('metric-busiest-year').textContent = busiestYear ? busiestYear[0] + ' (' + busiestYear[1] + ')' : '—';
    document.getElementById('metric-countries').textContent = regions.size;

    // ---- Chart 1: Flights & Distance by Year (combo bar + line) ----
    {
      const years = Object.keys(yearCounts).sort();
      const flightsByYear = years.map(y => yearCounts[y] || 0);
      const distByYear = years.map(y => {
        return flights.filter(f => f.date.split('/')[0] === y)
          .reduce((s, f) => s + (parseInt(f.distance) || 0), 0);
      });

      const ctx = document.getElementById('chart-yearly').getContext('2d');
      chartInstances.push(new Chart(ctx, {
        type: 'bar',
        data: {
          labels: years,
          datasets: [
            {
              label: 'Flights',
              data: flightsByYear,
              backgroundColor: CYAN + '55',
              borderColor: CYAN,
              borderWidth: 1,
              borderRadius: 4,
              yAxisID: 'y',
              order: 2,
            },
            {
              label: 'Distance (km)',
              data: distByYear,
              type: 'line',
              borderColor: GOLD,
              backgroundColor: GOLD + '15',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: GOLD,
              pointBorderColor: '#0a0a0f',
              pointBorderWidth: 2,
              fill: true,
              tension: 0.3,
              yAxisID: 'y1',
              order: 1,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: {
                label: function (ctx) {
                  if (ctx.dataset.label === 'Distance (km)') {
                    return 'Distance: ' + ctx.parsed.y.toLocaleString() + ' km';
                  }
                  return 'Flights: ' + ctx.parsed.y;
                }
              }
            }
          },
          scales: {
            x: { grid: { display: false } },
            y: {
              position: 'left',
              title: { display: true, text: 'Flights', color: CYAN },
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { stepSize: 5 },
            },
            y1: {
              position: 'right',
              title: { display: true, text: 'Distance (km)', color: GOLD },
              grid: { display: false },
              ticks: {
                callback: v => (v / 1000).toFixed(0) + 'k'
              },
            }
          }
        }
      }));
    }

    // ---- Chart 2: Top Airports (horizontal bar) ----
    {
      const airportCounts = {};
      flights.forEach(f => {
        airportCounts[f.depCode] = (airportCounts[f.depCode] || 0) + 1;
        airportCounts[f.arrCode] = (airportCounts[f.arrCode] || 0) + 1;
      });
      const sorted = Object.entries(airportCounts).sort((a, b) => b[1] - a[1]).slice(0, 15);
      const labels = sorted.map(([code]) => code + ' ' + (CODE_TO_CITY[code] || ''));
      const data = sorted.map(([, c]) => c);
      const colors = sorted.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length] + '99');
      const borderColors = sorted.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length]);

      const ctx = document.getElementById('chart-airports').getContext('2d');
      chartInstances.push(new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Appearances',
            data,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 1,
            borderRadius: 3,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ctx.parsed.x + ' flights'
              }
            }
          },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, title: { display: true, text: 'Flight Count' } },
            y: { grid: { display: false }, ticks: { font: { family: "'JetBrains Mono', monospace", size: 10 } } }
          }
        }
      }));
    }

    // ---- Chart 3: Region Distribution (doughnut) ----
    {
      const regionFlights = {};
      flights.forEach(f => {
        for (const [region, codes] of Object.entries(AIRPORT_REGIONS)) {
          if (codes.includes(f.depCode) || codes.includes(f.arrCode)) {
            regionFlights[region] = (regionFlights[region] || 0) + 1;
          }
        }
      });
      const sorted = Object.entries(regionFlights).sort((a, b) => b[1] - a[1]);
      const labels = sorted.map(([r]) => r);
      const data = sorted.map(([, c]) => c);

      const ctx = document.getElementById('chart-regions').getContext('2d');
      chartInstances.push(new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: CHART_PALETTE.slice(0, labels.length).map(c => c + 'bb'),
            borderColor: CHART_PALETTE.slice(0, labels.length),
            borderWidth: 1,
            hoverOffset: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '55%',
          plugins: {
            legend: {
              position: 'right',
              labels: { font: { size: 11 }, padding: 10 }
            },
            tooltip: {
              callbacks: {
                label: function (ctx) {
                  const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                  const pct = ((ctx.parsed / total) * 100).toFixed(1);
                  return ctx.label + ': ' + ctx.parsed + ' (' + pct + '%)';
                }
              }
            }
          }
        }
      }));
    }

    // ---- Chart 4: Top Airlines by Flight Count ----
    {
      const airlineCounts = {};
      flights.forEach(f => {
        airlineCounts[f.airline] = (airlineCounts[f.airline] || 0) + 1;
      });
      const sorted = Object.entries(airlineCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);
      const labels = sorted.map(([a]) => a);
      const data = sorted.map(([, c]) => c);
      const bgColors = labels.map(a => (AIRLINE_COLORS[a] || '#4f8fff') + '88');
      const brColors = labels.map(a => AIRLINE_COLORS[a] || '#4f8fff');

      const ctx = document.getElementById('chart-airlines-flights').getContext('2d');
      chartInstances.push(new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Flights',
            data,
            backgroundColor: bgColors,
            borderColor: brColors,
            borderWidth: 1,
            borderRadius: 3,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { grid: { display: false }, ticks: { font: { size: 10 } } }
          }
        }
      }));
    }

    // ---- Chart 5: Top Airlines by Distance ----
    {
      const airlineDist = {};
      flights.forEach(f => {
        airlineDist[f.airline] = (airlineDist[f.airline] || 0) + (parseInt(f.distance) || 0);
      });
      const sorted = Object.entries(airlineDist).sort((a, b) => b[1] - a[1]).slice(0, 12);
      const labels = sorted.map(([a]) => a);
      const data = sorted.map(([, d]) => d);
      const bgColors = labels.map(a => (AIRLINE_COLORS[a] || '#4f8fff') + '88');
      const brColors = labels.map(a => AIRLINE_COLORS[a] || '#4f8fff');

      const ctx = document.getElementById('chart-airlines-distance').getContext('2d');
      chartInstances.push(new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Distance (km)',
            data,
            backgroundColor: bgColors,
            borderColor: brColors,
            borderWidth: 1,
            borderRadius: 3,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ctx.parsed.x.toLocaleString() + ' km'
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { callback: v => (v / 1000).toFixed(0) + 'k km' }
            },
            y: { grid: { display: false }, ticks: { font: { size: 10 } } }
          }
        }
      }));
    }

    // ---- Chart 6: Monthly Flight Pattern (radar) ----
    {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyCounts = new Array(12).fill(0);
      const monthlyDist = new Array(12).fill(0);
      flights.forEach(f => {
        const m = parseInt(f.date.split('/')[1]) - 1;
        if (m >= 0 && m < 12) {
          monthlyCounts[m]++;
          monthlyDist[m] += parseInt(f.distance) || 0;
        }
      });

      const ctx = document.getElementById('chart-monthly').getContext('2d');
      chartInstances.push(new Chart(ctx, {
        type: 'radar',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Flights',
              data: monthlyCounts,
              borderColor: CYAN,
              backgroundColor: CYAN + '20',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: CYAN,
              pointBorderColor: '#0a0a0f',
              pointBorderWidth: 2,
            },
            {
              label: 'Distance (x1000 km)',
              data: monthlyDist.map(d => Math.round(d / 1000)),
              borderColor: PURPLE,
              backgroundColor: PURPLE + '15',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: PURPLE,
              pointBorderColor: '#0a0a0f',
              pointBorderWidth: 2,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } },
          scales: {
            r: {
              grid: { color: 'rgba(255,255,255,0.06)' },
              angleLines: { color: 'rgba(255,255,255,0.06)' },
              pointLabels: { font: { size: 11, weight: '500' }, color: '#8888a0' },
              ticks: { backdropColor: 'transparent', font: { size: 9 } },
            }
          }
        }
      }));
    }

    // ---- Chart 7: Day of Week (polar area) ----
    {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayCounts = new Array(7).fill(0);
      flights.forEach(f => {
        const parts = f.date.split('/');
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        if (!isNaN(d)) dayCounts[d.getDay()]++;
      });

      const ctx = document.getElementById('chart-weekday').getContext('2d');
      chartInstances.push(new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: days,
          datasets: [{
            data: dayCounts,
            backgroundColor: [RED + '77', ORANGE + '77', GOLD + '77', GREEN + '77', CYAN + '77', BLUE + '77', PURPLE + '77'],
            borderColor: [RED, ORANGE, GOLD, GREEN, CYAN, BLUE, PURPLE],
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { font: { size: 11 }, padding: 8 } }
          },
          scales: {
            r: {
              grid: { color: 'rgba(255,255,255,0.06)' },
              ticks: { backdropColor: 'transparent', font: { size: 9 } },
            }
          }
        }
      }));
    }

    // ---- Chart 8: Top Routes (horizontal bar) ----
    {
      const routeCounts = {};
      flights.forEach(f => {
        const key = [f.depCode, f.arrCode].sort().join(' - ');
        routeCounts[key] = (routeCounts[key] || 0) + 1;
      });
      const sorted = Object.entries(routeCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);
      const labels = sorted.map(([r]) => r);
      const data = sorted.map(([, c]) => c);

      const ctx = document.getElementById('chart-routes').getContext('2d');
      chartInstances.push(new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Times Flown',
            data,
            backgroundColor: data.map((_, i) => {
              const t = i / Math.max(data.length - 1, 1);
              return `rgba(0, ${Math.round(212 - t * 130)}, ${Math.round(255 - t * 100)}, 0.6)`;
            }),
            borderColor: data.map((_, i) => {
              const t = i / Math.max(data.length - 1, 1);
              return `rgba(0, ${Math.round(212 - t * 130)}, ${Math.round(255 - t * 100)}, 1)`;
            }),
            borderWidth: 1,
            borderRadius: 3,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { stepSize: 1 }
            },
            y: {
              grid: { display: false },
              ticks: { font: { family: "'JetBrains Mono', monospace", size: 10 } }
            }
          }
        }
      }));
    }
  }

  // ---- Toggle Analytics Overlay ----
  const overlay = document.getElementById('analytics-overlay');
  const openBtn = document.getElementById('toggle-analytics');
  const closeBtn = document.getElementById('close-analytics');

  function openAnalytics() {
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => overlay.classList.add('visible'));
    // Build charts from current allFlights data
    buildAnalytics(allFlights);
  }

  function closeAnalytics() {
    overlay.classList.remove('visible');
    setTimeout(() => {
      overlay.classList.add('hidden');
      destroyCharts();
    }, 400);
  }

  openBtn.addEventListener('click', openAnalytics);
  closeBtn.addEventListener('click', closeAnalytics);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
      closeAnalytics();
    }
  });
})();
