/* ============================================
   FLIGHT ATLAS — Core Application
   ============================================ */

// ---- Airport Geocoding Dictionary ----
const AIRPORT_COORDS = {
  // China
  '北京首都': { lat: 40.0799, lng: 116.6031, city: 'Beijing Capital', code: 'PEK' },
  '北京大兴': { lat: 39.5098, lng: 116.4105, city: 'Beijing Daxing', code: 'PKX' },
  '上海浦东': { lat: 31.1443, lng: 121.8083, city: 'Shanghai Pudong', code: 'PVG' },
  '上海虹桥': { lat: 31.1979, lng: 121.3363, city: 'Shanghai Hongqiao', code: 'SHA' },
  '深圳宝安': { lat: 22.6393, lng: 113.8107, city: 'Shenzhen', code: 'SZX' },
  '广州白云': { lat: 23.3924, lng: 113.2988, city: 'Guangzhou', code: 'CAN' },
  '香港国际': { lat: 22.3080, lng: 113.9185, city: 'Hong Kong', code: 'HKG' },
  '中国澳门': { lat: 22.1496, lng: 113.5920, city: 'Macau', code: 'MFM' },
  '大庆萨尔图': { lat: 46.7464, lng: 125.1408, city: 'Daqing', code: 'DQA' },
  '哈尔滨太平': { lat: 45.6234, lng: 126.2503, city: 'Harbin', code: 'HRB' },
  '大连周水子': { lat: 38.9657, lng: 121.5386, city: 'Dalian', code: 'DLC' },
  '青岛胶东': { lat: 36.3661, lng: 120.0955, city: 'Qingdao', code: 'TAO' },
  '青岛流亭': { lat: 36.2661, lng: 120.3744, city: 'Qingdao Liuting', code: 'TAO' },
  '天津滨海': { lat: 39.1244, lng: 117.3462, city: 'Tianjin', code: 'TSN' },
  '西安咸阳': { lat: 34.4471, lng: 108.7516, city: "Xi'an", code: 'XIY' },
  '长沙黄花': { lat: 28.1892, lng: 113.2200, city: 'Changsha', code: 'CSX' },
  '福州长乐': { lat: 25.9351, lng: 119.6631, city: 'Fuzhou', code: 'FOC' },
  '泉州晋江': { lat: 24.7964, lng: 118.5902, city: 'Quanzhou', code: 'JJN' },
  '宁波栎社': { lat: 29.8267, lng: 121.4612, city: 'Ningbo', code: 'NGB' },
  '海口美兰': { lat: 19.9349, lng: 110.4590, city: 'Haikou', code: 'HAK' },
  '惠州平潭': { lat: 23.0500, lng: 114.5994, city: 'Huizhou', code: 'HUZ' },

  // Japan
  '东京羽田': { lat: 35.5494, lng: 139.7798, city: 'Tokyo Haneda', code: 'HND' },
  '东京成田': { lat: 35.7647, lng: 140.3864, city: 'Tokyo Narita', code: 'NRT' },
  '大阪关西': { lat: 34.4320, lng: 135.2304, city: 'Osaka Kansai', code: 'KIX' },
  '大阪国际': { lat: 34.7855, lng: 135.4380, city: 'Osaka Itami', code: 'ITM' },
  '松山': { lat: 33.8272, lng: 132.6998, city: 'Matsuyama', code: 'MYJ' },
  '名古屋中部国际': { lat: 34.8584, lng: 136.8125, city: 'Nagoya Chubu', code: 'NGO' },

  // South Korea
  '首尔仁川国际': { lat: 37.4602, lng: 126.4407, city: 'Seoul Incheon', code: 'ICN' },

  // Southeast Asia
  '新加坡樟宜': { lat: 1.3644, lng: 103.9915, city: 'Singapore', code: 'SIN' },
  '吉隆坡国际': { lat: 2.7456, lng: 101.7099, city: 'Kuala Lumpur', code: 'KUL' },
  '曼谷素万那普国际': { lat: 13.6900, lng: 100.7501, city: 'Bangkok', code: 'BKK' },
  '金边国际': { lat: 11.5466, lng: 104.8442, city: 'Phnom Penh', code: 'PNH' },

  // South Asia
  '德里英迪拉甘地': { lat: 28.5562, lng: 77.1000, city: 'Delhi', code: 'DEL' },
  '孟买贾特拉帕蒂希瓦吉': { lat: 19.0896, lng: 72.8656, city: 'Mumbai', code: 'BOM' },
  '班加罗尔': { lat: 13.1986, lng: 77.7066, city: 'Bangalore', code: 'BLR' },
  '金奈国际': { lat: 12.9941, lng: 80.1709, city: 'Chennai', code: 'MAA' },
  '科伦坡班达拉奈克国际': { lat: 7.1808, lng: 79.8841, city: 'Colombo', code: 'CMB' },

  // Middle East
  '多哈哈马德国际': { lat: 25.2732, lng: 51.6081, city: 'Doha', code: 'DOH' },
  '利雅得': { lat: 24.9576, lng: 46.6988, city: 'Riyadh', code: 'RUH' },
  '安曼阿莉娅王后': { lat: 31.7226, lng: 35.9932, city: 'Amman', code: 'AMM' },
  '特拉维夫本古里安': { lat: 32.0055, lng: 34.8854, city: 'Tel Aviv', code: 'TLV' },

  // Europe
  '伦敦希思罗': { lat: 51.4700, lng: -0.4543, city: 'London Heathrow', code: 'LHR' },
  '巴黎戴高乐': { lat: 49.0097, lng: 2.5479, city: 'Paris CDG', code: 'CDG' },
  '法兰克福': { lat: 50.0379, lng: 8.5622, city: 'Frankfurt', code: 'FRA' },
  '慕尼黑': { lat: 48.3538, lng: 11.7861, city: 'Munich', code: 'MUC' },
  '苏黎世': { lat: 47.4647, lng: 8.5492, city: 'Zurich', code: 'ZRH' },
  '罗马菲乌米奇诺': { lat: 41.8003, lng: 12.2389, city: 'Rome FCO', code: 'FCO' },
  '阿姆斯特丹史基浦': { lat: 52.3105, lng: 4.7683, city: 'Amsterdam', code: 'AMS' },
  '巴塞罗那埃尔普拉特': { lat: 41.2971, lng: 2.0785, city: 'Barcelona', code: 'BCN' },
  '马德里巴拉哈斯': { lat: 40.4936, lng: -3.5668, city: 'Madrid', code: 'MAD' },
  '格拉纳达': { lat: 37.1881, lng: -3.7771, city: 'Granada', code: 'GRX' },
  '曼彻斯特': { lat: 53.3537, lng: -2.2750, city: 'Manchester', code: 'MAN' },

  // North America
  '旧金山国际': { lat: 37.6213, lng: -122.3790, city: 'San Francisco', code: 'SFO' },
  '洛杉矶国际': { lat: 33.9425, lng: -118.4081, city: 'Los Angeles', code: 'LAX' },
  '诺曼峰田圣何塞': { lat: 37.3639, lng: -121.9289, city: 'San Jose', code: 'SJC' },
  '西雅图塔克马国际': { lat: 47.4502, lng: -122.3088, city: 'Seattle', code: 'SEA' },
  '芝加哥奥黑尔': { lat: 41.9742, lng: -87.9073, city: 'Chicago ORD', code: 'ORD' },
  '纽约肯尼迪国际': { lat: 40.6413, lng: -73.7781, city: 'New York JFK', code: 'JFK' },
  '纽约纽瓦克国际': { lat: 40.6895, lng: -74.1745, city: 'Newark', code: 'EWR' },
  '休斯敦乔治布什洲际': { lat: 29.9902, lng: -95.3368, city: 'Houston IAH', code: 'IAH' },
  '休斯敦霍比': { lat: 29.6454, lng: -95.2789, city: 'Houston Hobby', code: 'HOU' },
  '达拉斯沃思堡国际': { lat: 32.8998, lng: -97.0403, city: 'Dallas DFW', code: 'DFW' },
  '爱田': { lat: 32.8481, lng: -96.8512, city: 'Dallas Love', code: 'DAL' },
  '多伦多皮尔逊': { lat: 43.6777, lng: -79.6248, city: 'Toronto', code: 'YYZ' },
  '明尼阿波利斯圣保罗': { lat: 44.8848, lng: -93.2223, city: 'Minneapolis', code: 'MSP' },
  '哈里里德国际': { lat: 36.0840, lng: -115.1537, city: 'Las Vegas', code: 'LAS' },
  '圣地亚哥国际': { lat: 32.7338, lng: -117.1933, city: 'San Diego', code: 'SAN' },
  '奥克兰都会': { lat: 37.7213, lng: -122.2208, city: 'Oakland', code: 'OAK' },
  '伯明翰沙特尔斯沃思国际': { lat: 33.5629, lng: -86.7535, city: 'Birmingham AL', code: 'BHM' },

  // Australia
  '悉尼金斯福德': { lat: -33.9461, lng: 151.1772, city: 'Sydney', code: 'SYD' },
  '墨尔本': { lat: -37.6690, lng: 144.8410, city: 'Melbourne', code: 'MEL' },
  '阿德莱德': { lat: -34.9461, lng: 138.5311, city: 'Adelaide', code: 'ADL' },
  '珀斯': { lat: -31.9403, lng: 115.9672, city: 'Perth', code: 'PER' },
};

// ---- Airline Color Palette ----
const AIRLINE_COLORS = {
  '日本航空': '#e3002c',
  '全日空航空': '#003d7c',
  '东方航空': '#003399',
  '南方航空': '#2c79df',
  '中国国航': '#d90012',
  '海南航空': '#e31837',
  '国泰航空': '#006564',
  '新加坡航空': '#f0ab00',
  '大韩航空': '#00487c',
  '韩亚航空': '#c40016',
  '卡塔尔航空': '#5c0632',
  '汉莎航空': '#05164d',
  '荷兰皇家航空': '#00a1de',
  '美国联合': '#002244',
  '美国航空': '#0078d2',
  '达美航空': '#003366',
  '西南航空': '#304cb2',
  '阿拉斯加航空': '#01426a',
  '泰国航空': '#6d2781',
  '深圳航空': '#00468b',
  '厦门航空': '#003fa8',
  '香港航空': '#c80815',
  '星悦航空': '#1a1a2e',
  '春秋航空': '#f7941d',
  '吉祥航空': '#e60012',
  '山东航空': '#fdb813',
  '上海航空': '#003da5',
  '港龙航空': '#be0028',
  '维珍航空': '#e10a0a',
  '斯里兰卡航空': '#1a3e72',
  '印度航空': '#dd1e26',
  '捷特航空': '#0a2351',
  '沙特航空': '#006633',
  '瑞士航空': '#e2001a',
  '伊比利亚航空': '#d81e05',
  '精神航空': '#fce300',
  '边疆航空': '#004731',
  '虎航': '#ff6600',
  '澳洲航空': '#e0001b',
  '加拿大航空': '#f01428',
};

function getAirlineColor(airline) {
  return AIRLINE_COLORS[airline] || '#4f8fff';
}

// ---- Airline IATA extraction (from flight number) ----
function getAirlineIATA(flightNo) {
  if (!flightNo) return '';
  const m = flightNo.match(/^([A-Z0-9]{2})/i);
  return m ? m[1].toUpperCase() : '';
}

function getAirlineLogoUrl(flightNo) {
  const iata = getAirlineIATA(flightNo);
  if (!iata) return '';
  return `logos/${iata}.webp`;
}

// ---- Region Groupings ----
const AIRLINE_REGIONS = {
  'China': ['中国国航', '东方航空', '南方航空', '海南航空', '深圳航空', '厦门航空', '春秋航空', '吉祥航空', '山东航空', '上海航空', '国泰航空', '香港航空', '港龙航空'],
  'Japan': ['日本航空', '全日空航空', '星悦航空'],
  'South Korea': ['大韩航空', '韩亚航空'],
  'Southeast Asia': ['新加坡航空', '泰国航空', '虎航'],
  'South Asia': ['斯里兰卡航空', '印度航空', '捷特航空'],
  'Middle East': ['卡塔尔航空', '沙特航空'],
  'Europe': ['汉莎航空', '荷兰皇家航空', '维珍航空', '瑞士航空', '伊比利亚航空'],
  'North America': ['美国联合', '美国航空', '达美航空', '西南航空', '阿拉斯加航空', '精神航空', '边疆航空', '加拿大航空'],
  'Australia': ['澳洲航空'],
};

const AIRPORT_REGIONS = {
  'China': ['PEK', 'PKX', 'PVG', 'SHA', 'SZX', 'CAN', 'HKG', 'MFM', 'DQA', 'HRB', 'DLC', 'TAO', 'TSN', 'XIY', 'CSX', 'FOC', 'JJN', 'NGB', 'HAK', 'HUZ'],
  'Japan': ['HND', 'NRT', 'KIX', 'ITM', 'MYJ', 'NGO'],
  'South Korea': ['ICN'],
  'Southeast Asia': ['SIN', 'KUL', 'BKK', 'PNH'],
  'South Asia': ['DEL', 'BOM', 'BLR', 'MAA', 'CMB'],
  'Middle East': ['DOH', 'RUH', 'AMM', 'TLV'],
  'Europe': ['LHR', 'CDG', 'FRA', 'MUC', 'ZRH', 'FCO', 'AMS', 'BCN', 'MAD', 'GRX', 'MAN'],
  'North America': ['SFO', 'LAX', 'SJC', 'SEA', 'ORD', 'JFK', 'EWR', 'IAH', 'HOU', 'DFW', 'DAL', 'YYZ', 'MSP', 'LAS', 'SAN', 'OAK', 'BHM'],
  'Australia': ['SYD', 'MEL', 'ADL', 'PER'],
};

// Build code→city lookup from AIRPORT_COORDS
const CODE_TO_CITY = {};
Object.values(AIRPORT_COORDS).forEach(a => {
  if (!CODE_TO_CITY[a.code]) CODE_TO_CITY[a.code] = a.city;
});

// ---- Heat Color ----
function getHeatColor(count, maxCount) {
  const t = Math.pow(Math.min(count / Math.max(maxCount, 1), 1), 0.5);
  const hue = 190 - t * 190; // 190 (cyan) → 0 (red)
  const sat = 85 + t * 15;
  const lum = 55 + t * 5;
  return `hsl(${hue}, ${sat}%, ${lum}%)`;
}

// ---- Parse CSV ----
function parseCSV(text) {
  const rows = d3.csvParse(text);
  const flights = rows.map(row => {
    const dep = AIRPORT_COORDS[row.departure_airport];
    const arr = AIRPORT_COORDS[row.arrival_city];
    if (!dep || !arr) {
      console.warn('Missing coords for:', row.departure_airport, '->', row.arrival_city);
      return null;
    }
    return {
      date: row.date,
      airline: row.airlines,
      flightNo: row.flight_no,
      depName: row.departure_airport,
      arrName: row.arrival_city,
      depCity: dep.city,
      arrCity: arr.city,
      depCode: dep.code,
      arrCode: arr.code,
      depTime: row.departure_time,
      arrTime: row.arrival_time,
      distance: row.distance,
      duration: row.flight_duration || '',
      durationHours: row.flight_duration_hours || '',
      durationMinutes: row.flight_duration_minutes || '',
      startLat: dep.lat,
      startLng: dep.lng,
      endLat: arr.lat,
      endLng: arr.lng,
      color: getAirlineColor(row.airlines),
    };
  }).filter(Boolean);

  // Assign route index for duplicate routes so arcs fan out at different altitudes
  const routeCounts = new Map();
  flights.forEach(f => {
    const routeKey = [f.depCode, f.arrCode].sort().join('-');
    const idx = routeCounts.get(routeKey) || 0;
    f.routeIndex = idx;
    routeCounts.set(routeKey, idx + 1);
  });

  return flights;
}

// ---- Build points from flights ----
function buildPoints(flights) {
  const pointMap = new Map();

  flights.forEach(f => {
    [
      { key: f.depCode, lat: f.startLat, lng: f.startLng, city: f.depCity, name: f.depName },
      { key: f.arrCode, lat: f.endLat, lng: f.endLng, city: f.arrCity, name: f.arrName },
    ].forEach(p => {
      if (!pointMap.has(p.key)) {
        pointMap.set(p.key, { ...p, code: p.key, count: 0, flights: [] });
      }
      const pt = pointMap.get(p.key);
      pt.count++;
      if (pt.flights.length < 8) {
        pt.flights.push(`${f.flightNo} ${f.depCode}→${f.arrCode}`);
      }
    });
  });

  return Array.from(pointMap.values());
}

function getFlightDurationMinutes(flight) {
  const hours = parseInt(flight.durationHours, 10);
  const minutes = parseInt(flight.durationMinutes, 10);

  if (!Number.isNaN(hours) || !Number.isNaN(minutes)) {
    return (Number.isNaN(hours) ? 0 : hours * 60) + (Number.isNaN(minutes) ? 0 : minutes);
  }

  // Backward-compatible fallback for values like "3 hours 05 minutes"
  const text = (flight.duration || '').toLowerCase();
  const m = text.match(/(\d+)\s*hours?\s*(\d+)\s*minutes?/);
  if (m) {
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }

  return null;
}

// ---- Stats ----
function updateStats(flights) {
  const airports = new Set();
  flights.forEach(f => { airports.add(f.depCode); airports.add(f.arrCode); });
  const totalDist = flights.reduce((sum, f) => {
    const d = parseInt(f.distance) || 0;
    return sum + d;
  }, 0);
  const totalDurationMin = flights.reduce((sum, f) => {
    const mins = getFlightDurationMinutes(f);
    return mins === null ? sum : sum + mins;
  }, 0);
  const totalDurationHours = Math.floor(totalDurationMin / 60);
  const totalDurationRemainMin = totalDurationMin % 60;
  const airlines = new Set(flights.map(f => f.airline));

  document.getElementById('stat-flights').textContent = flights.length;
  document.getElementById('stat-airports').textContent = airports.size;
  document.getElementById('stat-distance').textContent = totalDist.toLocaleString('en-US') + ' km';
  document.getElementById('stat-duration').textContent = `${totalDurationHours} hr ${String(totalDurationRemainMin).padStart(2, '0')} min`;
  document.getElementById('stat-airlines').textContent = airlines.size;
}

// ---- Flight List Panel ----
function renderFlightList(flights) {
  const container = document.getElementById('flight-list');
  container.innerHTML = '';
  flights.forEach(f => {
    const card = document.createElement('div');
    card.className = 'flight-card';
    const logoUrl = getAirlineLogoUrl(f.flightNo);
    card.innerHTML = `
      <div class="flight-card-logo" style="background:${f.color}15; border-color:${f.color}44;">
        ${logoUrl ? `<img src="${logoUrl}" alt="${f.airline}" onerror="this.style.display='none'; this.parentElement.classList.add('no-logo'); this.parentElement.innerHTML='<span class=\\'logo-fallback\\' style=\\'color:${f.color}\\'>${getAirlineIATA(f.flightNo)}</span>';" />` : `<span class="logo-fallback" style="color:${f.color}">${getAirlineIATA(f.flightNo)}</span>`}
      </div>
      <div class="flight-card-body">
        <div class="flight-card-header">
          <span class="flight-card-route">${f.depCode} → ${f.arrCode}</span>
          <span class="flight-card-date">${f.date}</span>
        </div>
        <div class="flight-card-details">
          <span class="flight-card-detail">
            <span class="flight-card-dot" style="background:${f.color}"></span>
            ${f.airline}
          </span>
          <span class="flight-card-detail">${f.flightNo}</span>
          <span class="flight-card-detail">${f.distance}</span>
          ${f.duration ? `<span class="flight-card-detail flight-card-duration">⏱ ${f.duration}</span>` : ''}
        </div>
      </div>
    `;
    card.addEventListener('mouseenter', () => {
      globe.pointOfView({ lat: (f.startLat + f.endLat) / 2, lng: (f.startLng + f.endLng) / 2, altitude: 2 }, 1000);
    });
    container.appendChild(card);
  });
}

// ---- Multi-Select Filter System ----
const filters = {};

function createMultiSelect(container, id, label, options, grouped) {
  const wrapper = document.createElement('div');
  wrapper.className = 'multi-select';
  wrapper.dataset.filter = id;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'multi-select-btn';
  btn.innerHTML = `<span class="ms-label">${label}</span><span class="ms-chevron">▾</span>`;

  const dropdown = document.createElement('div');
  dropdown.className = 'multi-select-dropdown';

  const actions = document.createElement('div');
  actions.className = 'ms-actions';
  actions.innerHTML = `
    <button type="button" class="ms-action" data-action="all">Select All</button>
    <button type="button" class="ms-action" data-action="clear">Clear All</button>
  `;
  dropdown.appendChild(actions);

  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'ms-options';

  if (grouped) {
    for (const [group, items] of Object.entries(options)) {
      const present = items.filter(i => i.present);
      if (present.length === 0) continue;
      const header = document.createElement('div');
      header.className = 'ms-group-header';
      header.textContent = group;
      optionsDiv.appendChild(header);
      present.forEach(item => {
        const lbl = document.createElement('label');
        lbl.className = 'ms-option';
        lbl.innerHTML = `<input type="checkbox" value="${item.value}" checked><span>${item.label}</span>`;
        optionsDiv.appendChild(lbl);
      });
    }
  } else {
    options.forEach(item => {
      const lbl = document.createElement('label');
      lbl.className = 'ms-option';
      lbl.innerHTML = `<input type="checkbox" value="${item}" checked><span>${item}</span>`;
      optionsDiv.appendChild(lbl);
    });
  }

  dropdown.appendChild(optionsDiv);
  wrapper.appendChild(btn);
  wrapper.appendChild(dropdown);
  container.appendChild(wrapper);

  // Toggle dropdown
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = wrapper.classList.contains('open');
    document.querySelectorAll('.multi-select.open').forEach(ms => ms.classList.remove('open'));
    if (!isOpen) wrapper.classList.add('open');
  });

  // Prevent dropdown clicks from closing
  dropdown.addEventListener('click', (e) => e.stopPropagation());

  // Actions
  actions.querySelector('[data-action="all"]').addEventListener('click', () => {
    optionsDiv.querySelectorAll('input').forEach(cb => { cb.checked = true; });
    updateLabel();
    applyFilters();
  });
  actions.querySelector('[data-action="clear"]').addEventListener('click', () => {
    optionsDiv.querySelectorAll('input').forEach(cb => { cb.checked = false; });
    updateLabel();
    applyFilters();
  });

  // Checkbox changes
  optionsDiv.addEventListener('change', () => {
    updateLabel();
    applyFilters();
  });

  function updateLabel() {
    const all = optionsDiv.querySelectorAll('input');
    const checked = optionsDiv.querySelectorAll('input:checked');
    const labelEl = btn.querySelector('.ms-label');
    if (checked.length === 0) {
      labelEl.textContent = 'None';
    } else if (checked.length === all.length) {
      labelEl.textContent = label;
    } else if (checked.length <= 2) {
      labelEl.textContent = Array.from(checked).map(c => c.value).join(', ');
    } else {
      labelEl.textContent = `${checked.length} selected`;
    }
  }

  const handle = {
    getSelected() {
      return Array.from(optionsDiv.querySelectorAll('input:checked')).map(c => c.value);
    },
    isAllSelected() {
      return optionsDiv.querySelectorAll('input').length === optionsDiv.querySelectorAll('input:checked').length;
    },
  };

  filters[id] = handle;
  return handle;
}

// Close all dropdowns on click outside
document.addEventListener('click', () => {
  document.querySelectorAll('.multi-select.open').forEach(ms => ms.classList.remove('open'));
});

function populateFilters(flights) {
  const container = document.getElementById('filter-group');
  container.innerHTML = '';

  // Year filter (simple list, newest first)
  const years = [...new Set(flights.map(f => f.date.split('/')[0]))].sort((a, b) => b - a);
  createMultiSelect(container, 'year', 'All Years', years, false);

  // Airline filter (grouped by region)
  const presentAirlines = new Set(flights.map(f => f.airline));
  const airlineOptions = {};
  for (const [region, list] of Object.entries(AIRLINE_REGIONS)) {
    airlineOptions[region] = list
      .filter(a => presentAirlines.has(a))
      .sort()
      .map(a => ({ value: a, label: a, present: true }));
  }
  createMultiSelect(container, 'airline', 'All Airlines', airlineOptions, true);

  // Airport filter (grouped by region)
  const presentAirports = new Set();
  flights.forEach(f => { presentAirports.add(f.depCode); presentAirports.add(f.arrCode); });
  const airportOptions = {};
  for (const [region, codes] of Object.entries(AIRPORT_REGIONS)) {
    airportOptions[region] = codes
      .filter(c => presentAirports.has(c))
      .sort()
      .map(c => ({ value: c, label: `${c} — ${CODE_TO_CITY[c] || c}`, present: true }));
  }
  createMultiSelect(container, 'airport', 'All Airports', airportOptions, true);
}

// ---- Tooltip ----
const tooltip = document.getElementById('tooltip');

function showArcTooltip(flight, event) {
  const logoUrl = getAirlineLogoUrl(flight.flightNo);
  const iata = getAirlineIATA(flight.flightNo);
  tooltip.innerHTML = `
    <div class="tooltip-header">
      <div class="tooltip-logo" style="background:${flight.color}18; border-color:${flight.color}55;">
        ${logoUrl ? `<img src="${logoUrl}" alt="${flight.airline}" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'logo-fallback\\' style=\\'color:${flight.color}\\'>${iata}</span>';" />` : `<span class="logo-fallback" style="color:${flight.color}">${iata}</span>`}
      </div>
      <div class="tooltip-route">
        <span class="tooltip-city">${flight.depCity}</span>
        <span class="tooltip-arrow">→</span>
        <span class="tooltip-city">${flight.arrCity}</span>
      </div>
    </div>
    <div class="tooltip-meta">
      <div class="tooltip-meta-item">
        <span class="tooltip-meta-label">Flight</span>
        <span class="tooltip-meta-value">${flight.flightNo}</span>
      </div>
      <div class="tooltip-meta-item">
        <span class="tooltip-meta-label">Airline</span>
        <span class="tooltip-meta-value">${flight.airline}</span>
      </div>
      <div class="tooltip-meta-item">
        <span class="tooltip-meta-label">Date</span>
        <span class="tooltip-meta-value">${flight.date}</span>
      </div>
      <div class="tooltip-meta-item">
        <span class="tooltip-meta-label">Distance</span>
        <span class="tooltip-meta-value">${flight.distance}</span>
      </div>
      ${flight.duration ? `<div class="tooltip-meta-item">
        <span class="tooltip-meta-label">Duration</span>
        <span class="tooltip-meta-value">${flight.duration}</span>
      </div>` : ''}
      <div class="tooltip-meta-item">
        <span class="tooltip-meta-label">Departure</span>
        <span class="tooltip-meta-value">${flight.depTime}</span>
      </div>
      <div class="tooltip-meta-item">
        <span class="tooltip-meta-label">Arrival</span>
        <span class="tooltip-meta-value">${flight.arrTime}</span>
      </div>
    </div>
  `;
  positionTooltip(event);
  tooltip.classList.remove('hidden');
}

function showPointTooltip(point, event) {
  tooltip.innerHTML = `
    <div class="tooltip-point-name">${point.city}</div>
    <div class="tooltip-point-count">${point.code} · ${point.count} flights</div>
    <div class="tooltip-point-flights">${point.flights.join('<br>')}</div>
  `;
  positionTooltip(event);
  tooltip.classList.remove('hidden');
}

function hideTooltip() {
  tooltip.classList.add('hidden');
}

function positionTooltip(event) {
  const x = event.clientX;
  const y = event.clientY;
  const pad = 16;
  const tw = tooltip.offsetWidth || 280;
  const th = tooltip.offsetHeight || 160;

  let left = x + pad;
  let top = y + pad;
  if (left + tw > window.innerWidth - pad) left = x - tw - pad;
  if (top + th > window.innerHeight - pad) top = y - th - pad;

  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
}

// ---- Minimal TopoJSON to GeoJSON converter ----
function topojsonFeature(topology, object) {
  const arcs = topology.arcs;
  function decodeArc(arcIdx) {
    const arc = arcs[arcIdx < 0 ? ~arcIdx : arcIdx];
    const coords = [];
    let x = 0, y = 0;
    for (const pt of arc) {
      x += pt[0];
      y += pt[1];
      coords.push([
        x * topology.transform.scale[0] + topology.transform.translate[0],
        y * topology.transform.scale[1] + topology.transform.translate[1],
      ]);
    }
    if (arcIdx < 0) coords.reverse();
    return coords;
  }

  function decodeRing(indices) {
    const coords = [];
    for (const idx of indices) {
      const decoded = decodeArc(idx);
      // Skip the first point of subsequent arcs to avoid duplicates
      const start = coords.length > 0 ? 1 : 0;
      for (let i = start; i < decoded.length; i++) {
        coords.push(decoded[i]);
      }
    }
    return coords;
  }

  function decodeGeometry(geom) {
    if (geom.type === 'Polygon') {
      return { type: 'Polygon', coordinates: geom.arcs.map(decodeRing) };
    } else if (geom.type === 'MultiPolygon') {
      return { type: 'MultiPolygon', coordinates: geom.arcs.map(poly => poly.map(decodeRing)) };
    } else if (geom.type === 'GeometryCollection') {
      return { type: 'GeometryCollection', geometries: geom.geometries.map(decodeGeometry) };
    }
    return geom;
  }

  const features = object.geometries.map(geom => ({
    type: 'Feature',
    properties: geom.properties || {},
    geometry: decodeGeometry(geom),
  }));

  return { type: 'FeatureCollection', features };
}

// ---- Airport Marker Element ----
function createMarkerElement(d, allPoints) {
  const maxCount = Math.max(...allPoints.map(p => p.count));
  const color = getHeatColor(d.count, maxCount);
  const el = document.createElement('div');
  el.className = 'airport-marker';
  const size = Math.max(20, Math.min(d.count * 1.5 + 16, 48));
  const dotSize = Math.max(5, Math.min(d.count * 0.4 + 4, 12));
  el.style.width = size + 'px';
  el.style.height = size + 'px';
  el.innerHTML = `
    <div class="marker-glow" style="background: radial-gradient(circle, ${color}55 0%, transparent 70%);"></div>
    <div class="marker-dot" style="background: ${color}; color: ${color}; width: ${dotSize}px; height: ${dotSize}px;"></div>
  `;
  el.style.pointerEvents = 'auto';
  el.addEventListener('mouseenter', (e) => {
    document.body.style.cursor = 'pointer';
    showPointTooltip(d, e);
  });
  el.addEventListener('mouseleave', () => {
    document.body.style.cursor = 'default';
    hideTooltip();
  });
  return el;
}

// ---- Globe setup ----
let globe;
let allFlights = [];
let rotationPaused = false; // User-toggled pause state

async function init() {
  // Fetch CSV
  const resp = await fetch('itinierary.csv');
  const text = await resp.text();
  allFlights = parseCSV(text);
  const points = buildPoints(allFlights);

  updateStats(allFlights);
  populateFilters(allFlights);
  renderFlightList(allFlights);

  // Fetch country borders GeoJSON for polygon overlay
  let countries = [];
  try {
    const topoResp = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    const topoData = await topoResp.json();
    // Convert TopoJSON to GeoJSON features
    const topoFeature = topojsonFeature(topoData, topoData.objects.countries);
    countries = topoFeature.features;
  } catch (e) {
    console.warn('Could not load country borders:', e);
  }

  // Create globe — mount to DOM first, then configure
  globe = Globe()(document.getElementById('globe-container'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    .showAtmosphere(true)
    .atmosphereColor('#4f8fff')
    .atmosphereAltitude(0.18)
    // Country borders
    .polygonsData(countries)
    .polygonCapColor(() => 'rgba(0,0,0,0)')
    .polygonSideColor(() => 'rgba(0,0,0,0)')
    .polygonStrokeColor(() => 'rgba(0, 212, 255, 0.4)')
    .polygonAltitude(0.001)
    // Arcs
    .arcsData(allFlights)
    .arcStartLat('startLat')
    .arcStartLng('startLng')
    .arcEndLat('endLat')
    .arcEndLng('endLng')
    .arcColor(d => [`${d.color}dd`, `${d.color}44`])
    .arcAltitude(d => {
      // Fan out duplicate routes at different altitudes
      const dist = Math.sqrt(
        Math.pow(d.endLat - d.startLat, 2) + Math.pow(d.endLng - d.startLng, 2)
      );
      const baseAlt = dist * 0.4 / 90; // approximate auto-scale behavior
      return Math.max(0.02, baseAlt + d.routeIndex * 0.04);
    })
    .arcStroke(0.4)
    .arcDashLength(0.6)
    .arcDashGap(0.3)
    .arcDashAnimateTime(() => 2000 + Math.random() * 2000)
    .onArcHover((arc) => {
      if (arc) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
        hideTooltip();
      }
    })
    // HTML airport markers — heat-colored, hoverable above arcs
    .htmlElementsData(points)
    .htmlLat('lat')
    .htmlLng('lng')
    .htmlAltitude(0.005)
    .htmlElement(d => createMarkerElement(d, points));

  // Renderer settings
  const renderer = globe.renderer();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Globe material tweaks
  const scene = globe.scene();
  const globeMesh = scene.children.find(c => c.type === 'Group');
  if (globeMesh) {
    globeMesh.rotation.y = -Math.PI / 2;
  }

  // Controls
  const controls = globe.controls();
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 0.8;
  controls.minDistance = 120;
  controls.maxDistance = 500;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.3;

  // Initial view — center on Asia
  globe.pointOfView({ lat: 30, lng: 110, altitude: 2.5 }, 0);

  // Custom hover handling for arcs via globe events
  globe
    .onArcHover((arc) => {
      if (arc) {
        document.body.style.cursor = 'pointer';
        const handler = (e) => {
          showArcTooltip(arc, e);
          document.removeEventListener('mousemove', handler);
        };
        document.addEventListener('mousemove', handler);
      } else {
        document.body.style.cursor = 'default';
        hideTooltip();
      }
    });

  // Track mouse position for continuous tooltip
  document.addEventListener('mousemove', (e) => {
    if (!tooltip.classList.contains('hidden')) {
      positionTooltip(e);
    }
  });

  // Stop auto-rotate on interaction (respect user pause)
  const container = document.getElementById('globe-container');
  container.addEventListener('mousedown', () => {
    controls.autoRotate = false;
  });
  // Resume after 8 seconds idle — only if not user-paused
  let idleTimer;
  container.addEventListener('mouseup', () => {
    clearTimeout(idleTimer);
    if (!rotationPaused) {
      idleTimer = setTimeout(() => { controls.autoRotate = true; }, 8000);
    }
  });

  // Pause/Resume rotation button
  const rotBtn = document.getElementById('toggle-rotation');
  const iconPause = rotBtn.querySelector('.icon-pause');
  const iconPlay = rotBtn.querySelector('.icon-play');
  rotBtn.addEventListener('click', () => {
    rotationPaused = !rotationPaused;
    controls.autoRotate = !rotationPaused;
    clearTimeout(idleTimer);
    iconPause.classList.toggle('hidden', rotationPaused);
    iconPlay.classList.toggle('hidden', !rotationPaused);
    rotBtn.title = rotationPaused ? 'Resume Rotation' : 'Pause Rotation';
  });

  // Fade out loader
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('fade-out');
  }, 800);

  // Resize
  window.addEventListener('resize', () => {
    globe.width(window.innerWidth);
    globe.height(window.innerHeight);
  });
}

// ---- Panel toggle ----
const toggleBtn = document.getElementById('toggle-panel');
const sidePanel = document.getElementById('side-panel');
let panelOpen = false;

toggleBtn.addEventListener('click', () => {
  panelOpen = !panelOpen;
  sidePanel.classList.toggle('open', panelOpen);
});

// ---- Filters ----
function applyFilters() {
  if (!filters.year || !filters.airline || !filters.airport) return;

  let filtered = allFlights;

  // Year filter
  if (!filters.year.isAllSelected()) {
    const selectedYears = new Set(filters.year.getSelected());
    filtered = filtered.filter(f => selectedYears.has(f.date.split('/')[0]));
  }

  // Airline filter
  if (!filters.airline.isAllSelected()) {
    const selectedAirlines = new Set(filters.airline.getSelected());
    filtered = filtered.filter(f => selectedAirlines.has(f.airline));
  }

  // Airport filter
  if (!filters.airport.isAllSelected()) {
    const selectedAirports = new Set(filters.airport.getSelected());
    filtered = filtered.filter(f => selectedAirports.has(f.depCode) || selectedAirports.has(f.arrCode));
  }

  // Re-assign route indices for filtered set
  const routeCounts = new Map();
  filtered.forEach(f => {
    const routeKey = [f.depCode, f.arrCode].sort().join('-');
    const idx = routeCounts.get(routeKey) || 0;
    f.routeIndex = idx;
    routeCounts.set(routeKey, idx + 1);
  });

  // Update globe
  globe.arcsData(filtered);
  const points = buildPoints(filtered);
  globe.htmlElementsData(points);

  // Update list
  renderFlightList(filtered);
  updateStats(filtered);
}

// ---- Launch ----
init();
