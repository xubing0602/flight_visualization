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

    // Average flight duration
    const flightsWithDuration = flights.filter(f => f.durationHours && f.durationMinutes);
    let avgDurationText = '—';
    if (flightsWithDuration.length > 0) {
      const totalDurationHours = flightsWithDuration.reduce((sum, f) => {
        const hours = parseFloat(f.durationHours) || 0;
        const mins = parseFloat(f.durationMinutes) || 0;
        return sum + hours + mins / 60;
      }, 0);
      const avgHours = totalDurationHours / flightsWithDuration.length;
      const h = Math.floor(avgHours);
      const m = Math.round((avgHours - h) * 60);
      avgDurationText = `${h}h ${m}m`;
    }

    document.getElementById('metric-earth-laps').textContent = laps + 'x';
    document.getElementById('metric-avg-dist').textContent = avgDist.toLocaleString() + ' km';
    document.getElementById('metric-avg-duration').textContent = avgDurationText;
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

    // ---- Chart 9: Average Duration by Airline ----
    {
      const flightsWithDuration = flights.filter(f => f.durationHours && f.durationMinutes);
      if (flightsWithDuration.length > 0) {
        const airlineDurations = {};
        flightsWithDuration.forEach(f => {
          const hours = parseFloat(f.durationHours) || 0;
          const mins = parseFloat(f.durationMinutes) || 0;
          const totalHours = hours + mins / 60;
          if (!airlineDurations[f.airline]) {
            airlineDurations[f.airline] = { total: 0, count: 0 };
          }
          airlineDurations[f.airline].total += totalHours;
          airlineDurations[f.airline].count++;
        });

        const sorted = Object.entries(airlineDurations)
          .map(([airline, stats]) => ({ airline, avg: stats.total / stats.count }))
          .sort((a, b) => b.avg - a.avg)
          .slice(0, 12);

        const labels = sorted.map(s => s.airline);
        const data = sorted.map(s => s.avg);
        const bgColors = labels.map(a => (AIRLINE_COLORS[a] || '#4f8fff') + '88');
        const brColors = labels.map(a => AIRLINE_COLORS[a] || '#4f8fff');

        const ctx = document.getElementById('chart-airline-duration').getContext('2d');
        chartInstances.push(new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Avg Hours',
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
                  label: ctx => {
                    const h = Math.floor(ctx.parsed.x);
                    const m = Math.round((ctx.parsed.x - h) * 60);
                    return `${h}h ${m}m`;
                  }
                }
              }
            },
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.04)' }, title: { display: true, text: 'Average Flight Duration (hours)' } },
              y: { grid: { display: false }, ticks: { font: { size: 10 } } }
            }
          }
        }));
      }
    }

    // ---- Chart 10: Flight Duration Distribution (histogram) ----
    {
      const flightsWithDuration = flights.filter(f => f.durationHours && f.durationMinutes);
      if (flightsWithDuration.length > 0) {
        const durations = flightsWithDuration.map(f => {
          const hours = parseFloat(f.durationHours) || 0;
          const mins = parseFloat(f.durationMinutes) || 0;
          return hours + mins / 60;
        });

        // Create histogram buckets (0-1h, 1-2h, 2-3h, ..., 15+h)
        const buckets = Array.from({ length: 16 }, (_, i) => ({ min: i, max: i + 1, count: 0, label: i < 15 ? `${i}-${i+1}h` : '15+h' }));
        durations.forEach(d => {
          const idx = Math.min(Math.floor(d), 15);
          buckets[idx].count++;
        });

        const labels = buckets.map(b => b.label);
        const data = buckets.map(b => b.count);

        const ctx = document.getElementById('chart-duration-dist').getContext('2d');
        chartInstances.push(new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Flights',
              data,
              backgroundColor: PURPLE + '77',
              borderColor: PURPLE,
              borderWidth: 1,
              borderRadius: 4,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, title: { display: true, text: 'Flight Duration' } },
              y: { grid: { color: 'rgba(255,255,255,0.04)' }, title: { display: true, text: 'Number of Flights' }, ticks: { stepSize: 5 } }
            }
          }
        }));
      }
    }

    // ---- Yearly Flight Heatmap (HTML, not Chart.js) ----
    {
      const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const DAYS_IN_MONTH = [31,29,31,30,31,30,31,31,30,31,30,31]; // 366-day leap calendar

      // Aggregate flights by "MM-DD" across all years
      const dayFlights = {};
      flights.forEach(f => {
        const parts = f.date.split('/');
        if (parts.length < 3) return;
        const key = `${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;
        if (!dayFlights[key]) dayFlights[key] = [];
        dayFlights[key].push(f);
      });

      const countValues = Object.values(dayFlights).map(a => a.length);
      const maxCount = countValues.length > 0 ? Math.max(...countValues) : 1;
      const flownDays = countValues.length;

      function cellColor(count) {
        if (count === 0) return 'rgba(255,255,255,0.06)';
        const t = Math.pow(count / maxCount, 0.45);
        return `rgba(0, 212, 255, ${(0.22 + t * 0.78).toFixed(2)})`;
      }

      const container = document.getElementById('heatmap-container');
      container.innerHTML = '';

      // Summary line
      const summary = document.createElement('div');
      summary.className = 'heatmap-summary';
      summary.innerHTML = `
        <span class="heatmap-stat-num">${flownDays}</span>
        <span class="heatmap-stat-sep">/ 366</span>
        <span class="heatmap-stat-text">calendar days have at least one flight</span>
      `;
      container.appendChild(summary);

      // Grid: 1 label column + 31 day columns
      const grid = document.createElement('div');
      grid.className = 'heatmap-grid';

      // Header row — day numbers
      const blankLabel = document.createElement('div');
      blankLabel.className = 'heatmap-month-label';
      grid.appendChild(blankLabel);
      for (let d = 1; d <= 31; d++) {
        const hd = document.createElement('div');
        hd.className = 'heatmap-day-num';
        hd.textContent = [1,5,10,15,20,25,31].includes(d) ? d : '';
        grid.appendChild(hd);
      }

      // Month rows
      MONTHS.forEach((month, mIdx) => {
        const label = document.createElement('div');
        label.className = 'heatmap-month-label';
        label.textContent = month;
        grid.appendChild(label);

        for (let d = 1; d <= 31; d++) {
          const cell = document.createElement('div');
          if (d > DAYS_IN_MONTH[mIdx]) {
            cell.className = 'heatmap-cell heatmap-cell-void';
          } else {
            const key = `${String(mIdx + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const cellFlights = dayFlights[key] || [];
            const count = cellFlights.length;
            cell.className = 'heatmap-cell';
            cell.style.backgroundColor = cellColor(count);
            if (count > 0 && count / maxCount > 0.5) {
              cell.style.boxShadow = `0 0 6px rgba(0,212,255,0.45)`;
            }
            const tooltipEl = document.getElementById('tooltip');
            cell.addEventListener('mouseenter', e => {
              const rows = cellFlights
                .sort((a, b) => a.date.localeCompare(b.date))
                .map(f => `
                  <div class="heatmap-tip-row">
                    <span class="heatmap-tip-year">${f.date.split('/')[0]}</span>
                    <span class="heatmap-tip-fn">${f.flightNo}</span>
                    <span class="heatmap-tip-route">${f.depCode} → ${f.arrCode}</span>
                  </div>`).join('');
              tooltipEl.innerHTML = `
                <div class="heatmap-tip-header">${month} ${d} · <strong>${count} flight${count !== 1 ? 's' : ''}</strong></div>
                ${rows}`;
              positionTooltip(e);
              tooltipEl.classList.remove('hidden');
            });
            cell.addEventListener('mouseleave', () => tooltipEl.classList.add('hidden'));
          }
          grid.appendChild(cell);
        }
      });

      container.appendChild(grid);

      // Legend
      const legend = document.createElement('div');
      legend.className = 'heatmap-legend';
      const legendCells = [0,1,2,3,4].map(l => {
        const fakeCount = l === 0 ? 0 : Math.max(1, Math.round(maxCount * l / 4));
        return `<div class="heatmap-legend-cell" style="background:${cellColor(fakeCount)}"></div>`;
      }).join('');
      legend.innerHTML = `<span class="heatmap-legend-label">Less</span>${legendCells}<span class="heatmap-legend-label">More</span>`;
      container.appendChild(legend);
    }

    // ---- Top 10 Busiest Calendar Days (horizontal bar) ----
    {
      const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const dayCounts = {};
      flights.forEach(f => {
        const parts = f.date.split('/');
        if (parts.length < 3) return;
        const key = `${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;
        dayCounts[key] = (dayCounts[key] || 0) + 1;
      });

      const sorted = Object.entries(dayCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      const labels = sorted.map(([key]) => {
        const [m, d] = key.split('-');
        return `${MONTHS_SHORT[parseInt(m, 10) - 1]} ${parseInt(d, 10)}`;
      });
      const data = sorted.map(([, c]) => c);
      const maxVal = Math.max(...data, 1);
      const bgColors = data.map(c => {
        const t = Math.pow(c / maxVal, 0.45);
        return `rgba(0, 212, 255, ${(0.22 + t * 0.78).toFixed(2)})`;
      });

      const ctx = document.getElementById('chart-busiest-days').getContext('2d');
      chartInstances.push(new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Flights',
            data,
            backgroundColor: bgColors,
            borderColor: bgColors,
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
                label: ctx => `${ctx.parsed.x} flight${ctx.parsed.x !== 1 ? 's' : ''} (all years combined)`
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              title: { display: true, text: 'Total flights across all years' },
              ticks: { stepSize: 1 }
            },
            y: { grid: { display: false }, ticks: { font: { family: "'JetBrains Mono', monospace", size: 11 } } }
          }
        }
      }));
    }

    // ---- Flight Days per Month (bar + coverage % line) ----
    {
      const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const DAYS_IN_MONTH = [31,29,31,30,31,30,31,31,30,31,30,31];

      const daysSeen = Array.from({length: 12}, () => new Set());
      flights.forEach(f => {
        const parts = f.date.split('/');
        if (parts.length < 3) return;
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (m >= 0 && m < 12) daysSeen[m].add(d);
      });

      const flightDays = daysSeen.map(s => s.size);
      const coverage = flightDays.map((d, i) => parseFloat(((d / DAYS_IN_MONTH[i]) * 100).toFixed(1)));

      const ctx = document.getElementById('chart-flight-days-month').getContext('2d');
      chartInstances.push(new Chart(ctx, {
        type: 'bar',
        data: {
          labels: MONTHS_SHORT,
          datasets: [
            {
              label: 'Days Flown',
              data: flightDays,
              backgroundColor: CYAN + '55',
              borderColor: CYAN,
              borderWidth: 1,
              borderRadius: 4,
              yAxisID: 'y',
              order: 2,
            },
            {
              label: 'Coverage %',
              data: coverage,
              type: 'line',
              borderColor: GOLD,
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: GOLD,
              pointBorderColor: '#0a0a0f',
              pointBorderWidth: 2,
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
                label: ctx => ctx.dataset.label === 'Coverage %'
                  ? `Coverage: ${ctx.parsed.y}% of days`
                  : `Days flown: ${ctx.parsed.y}`
              }
            }
          },
          scales: {
            x: { grid: { display: false } },
            y: {
              position: 'left',
              title: { display: true, text: 'Unique Days Flown', color: CYAN },
              grid: { color: 'rgba(255,255,255,0.04)' },
              min: 0,
              ticks: { stepSize: 1 }
            },
            y1: {
              position: 'right',
              title: { display: true, text: 'Coverage %', color: GOLD },
              grid: { display: false },
              min: 0,
              max: 100,
              ticks: { callback: v => v + '%' }
            }
          }
        }
      }));
    }

    // ---- Day-of-Month Pattern (bars 1–31) ----
    {
      function ordinal(n) {
        const s = ['th','st','nd','rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      }

      const domCounts = new Array(31).fill(0);
      flights.forEach(f => {
        const parts = f.date.split('/');
        if (parts.length < 3) return;
        const d = parseInt(parts[2], 10);
        if (d >= 1 && d <= 31) domCounts[d - 1]++;
      });

      const labels = Array.from({length: 31}, (_, i) => i + 1);
      const maxVal = Math.max(...domCounts, 1);

      const ctx = document.getElementById('chart-dom-pattern').getContext('2d');
      chartInstances.push(new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Flights',
            data: domCounts,
            backgroundColor: domCounts.map(c => {
              const t = c / maxVal;
              return `rgba(168, 85, 247, ${(0.25 + t * 0.7).toFixed(2)})`;
            }),
            borderColor: domCounts.map(c => {
              const t = c / maxVal;
              return `rgba(168, 85, 247, ${(0.5 + t * 0.5).toFixed(2)})`;
            }),
            borderWidth: 1,
            borderRadius: 3,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => `${ctx.parsed.y} flight${ctx.parsed.y !== 1 ? 's' : ''} on the ${ordinal(ctx.label)} of the month`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              title: { display: true, text: 'Day of Month' }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              title: { display: true, text: 'Total Flights' },
              ticks: { stepSize: 1 }
            }
          }
        }
      }));
    }

    // ---- Chart 11: Top 10 Longest Flights (horizontal bar) ----
    {
      const withDist = flights.filter(f => parseInt(f.distance) > 0);
      const longest10 = [...withDist].sort((a, b) => (parseInt(b.distance) || 0) - (parseInt(a.distance) || 0)).slice(0, 10);
      const labels = longest10.map(f => `${f.depCode}→${f.arrCode} ${f.date}`);
      const data = longest10.map(f => parseInt(f.distance) || 0);

      const ctx = document.getElementById('chart-longest-flights').getContext('2d');
      chartInstances.push(new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Distance (km)',
            data,
            backgroundColor: data.map((_, i) => {
              const t = i / Math.max(data.length - 1, 1);
              return `rgba(${Math.round(239 - t * 110)}, ${Math.round(68 + t * 116)}, ${Math.round(68 + t * 187)}, 0.7)`;
            }),
            borderColor: data.map((_, i) => {
              const t = i / Math.max(data.length - 1, 1);
              return `rgba(${Math.round(239 - t * 110)}, ${Math.round(68 + t * 116)}, ${Math.round(68 + t * 187)}, 1)`;
            }),
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
                label: ctx => {
                  const f = longest10[ctx.dataIndex];
                  return `${ctx.parsed.x.toLocaleString()} km · ${f.airline} · ${f.flightNo}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              title: { display: true, text: 'Distance (km)' },
              ticks: { callback: v => (v / 1000).toFixed(0) + 'k' }
            },
            y: { grid: { display: false }, ticks: { font: { family: "'JetBrains Mono', monospace", size: 10 } } }
          }
        }
      }));
    }

    // ---- Chart 12: Top 10 Shortest Flights (horizontal bar) ----
    {
      const withDist = flights.filter(f => parseInt(f.distance) > 0);
      const shortest10 = [...withDist].sort((a, b) => (parseInt(a.distance) || 0) - (parseInt(b.distance) || 0)).slice(0, 10);
      const labels = shortest10.map(f => `${f.depCode}→${f.arrCode} ${f.date}`);
      const data = shortest10.map(f => parseInt(f.distance) || 0);

      const ctx = document.getElementById('chart-shortest-flights').getContext('2d');
      chartInstances.push(new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Distance (km)',
            data,
            backgroundColor: data.map((_, i) => {
              const t = i / Math.max(data.length - 1, 1);
              return `rgba(${Math.round(16 + t * 0)}, ${Math.round(185 - t * 60)}, ${Math.round(129 - t * 50)}, 0.7)`;
            }),
            borderColor: data.map((_, i) => {
              const t = i / Math.max(data.length - 1, 1);
              return `rgba(${Math.round(16 + t * 0)}, ${Math.round(185 - t * 60)}, ${Math.round(129 - t * 50)}, 1)`;
            }),
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
                label: ctx => {
                  const f = shortest10[ctx.dataIndex];
                  return `${ctx.parsed.x.toLocaleString()} km · ${f.airline} · ${f.flightNo}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              title: { display: true, text: 'Distance (km)' },
            },
            y: { grid: { display: false }, ticks: { font: { family: "'JetBrains Mono', monospace", size: 10 } } }
          }
        }
      }));
    }

    // ---- Chart 13: Distance vs Duration (scatter) ----
    {
      const flightsWithDuration = flights.filter(f => f.durationHours && f.durationMinutes && f.distance);
      if (flightsWithDuration.length > 0) {
        const scatterData = flightsWithDuration.map(f => {
          const hours = parseFloat(f.durationHours) || 0;
          const mins = parseFloat(f.durationMinutes) || 0;
          const totalHours = hours + mins / 60;
          const distance = parseInt(f.distance) || 0;
          return { x: distance, y: totalHours, label: `${f.flightNo} ${f.depCode}-${f.arrCode}` };
        });

        const ctx = document.getElementById('chart-distance-duration').getContext('2d');
        chartInstances.push(new Chart(ctx, {
          type: 'scatter',
          data: {
            datasets: [{
              label: 'Flights',
              data: scatterData,
              backgroundColor: CYAN + '77',
              borderColor: CYAN,
              borderWidth: 1,
              pointRadius: 5,
              pointHoverRadius: 8,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: ctx => {
                    const point = scatterData[ctx.dataIndex];
                    const h = Math.floor(point.y);
                    const m = Math.round((point.y - h) * 60);
                    return `${point.label}: ${point.x}km in ${h}h ${m}m`;
                  }
                }
              }
            },
            scales: {
              x: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                title: { display: true, text: 'Distance (km)' },
                ticks: { callback: v => (v / 1000).toFixed(0) + 'k' }
              },
              y: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                title: { display: true, text: 'Flight Duration (hours)' },
                ticks: { callback: v => v.toFixed(1) + 'h' }
              }
            }
          }
        }));
      }
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
