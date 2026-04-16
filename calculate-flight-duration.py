#!/usr/bin/env python3
"""
Calculate actual flight durations from departure/arrival times with timezone support.

Requirements:
    pip install timezonefinder

Usage:
    python3 calculate-flight-duration.py

This script reads itinierary.csv and updates it in place with:
  - 'flight_duration' (e.g., "3 hours 25 minutes")
  - 'flight_duration_hours'
  - 'flight_duration_minutes'
"""

import csv
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from timezonefinder import TimezoneFinder

# Airport coordinates from app.js (Chinese name -> code mapping)
AIRPORT_COORDS = {
    # China
    '北京首都': {'lat': 40.0799, 'lng': 116.6031, 'code': 'PEK'},
    '北京大兴': {'lat': 39.5098, 'lng': 116.4105, 'code': 'PKX'},
    '上海浦东': {'lat': 31.1443, 'lng': 121.8083, 'code': 'PVG'},
    '上海虹桥': {'lat': 31.1979, 'lng': 121.3363, 'code': 'SHA'},
    '深圳宝安': {'lat': 22.6393, 'lng': 113.8107, 'code': 'SZX'},
    '广州白云': {'lat': 23.3924, 'lng': 113.2988, 'code': 'CAN'},
    '香港国际': {'lat': 22.3080, 'lng': 113.9185, 'code': 'HKG'},
    '中国澳门': {'lat': 22.1496, 'lng': 113.5920, 'code': 'MFM'},
    '大庆萨尔图': {'lat': 46.7464, 'lng': 125.1408, 'code': 'DQA'},
    '哈尔滨太平': {'lat': 45.6234, 'lng': 126.2503, 'code': 'HRB'},
    '大连周水子': {'lat': 38.9657, 'lng': 121.5386, 'code': 'DLC'},
    '青岛胶东': {'lat': 36.3661, 'lng': 120.0955, 'code': 'TAO'},
    '青岛流亭': {'lat': 36.2661, 'lng': 120.3744, 'code': 'TAO'},
    '天津滨海': {'lat': 39.1244, 'lng': 117.3462, 'code': 'TSN'},
    '西安咸阳': {'lat': 34.4471, 'lng': 108.7516, 'code': 'XIY'},
    '长沙黄花': {'lat': 28.1892, 'lng': 113.2200, 'code': 'CSX'},
    '福州长乐': {'lat': 25.9351, 'lng': 119.6631, 'code': 'FOC'},
    '泉州晋江': {'lat': 24.7964, 'lng': 118.5902, 'code': 'JJN'},
    '宁波栎社': {'lat': 29.8267, 'lng': 121.4612, 'code': 'NGB'},
    '海口美兰': {'lat': 19.9349, 'lng': 110.4590, 'code': 'HAK'},
    '惠州平潭': {'lat': 23.0500, 'lng': 114.5994, 'code': 'HUZ'},
    # Japan
    '东京羽田': {'lat': 35.5494, 'lng': 139.7798, 'code': 'HND'},
    '东京成田': {'lat': 35.7647, 'lng': 140.3864, 'code': 'NRT'},
    '大阪关西': {'lat': 34.4320, 'lng': 135.2304, 'code': 'KIX'},
    '大阪国际': {'lat': 34.7855, 'lng': 135.4380, 'code': 'ITM'},
    '松山': {'lat': 33.8272, 'lng': 132.6998, 'code': 'MYJ'},
    '名古屋中部国际': {'lat': 34.8584, 'lng': 136.8125, 'code': 'NGO'},
    # South Korea
    '首尔仁川国际': {'lat': 37.4602, 'lng': 126.4407, 'code': 'ICN'},
    # Southeast Asia
    '新加坡樟宜': {'lat': 1.3644, 'lng': 103.9915, 'code': 'SIN'},
    '吉隆坡国际': {'lat': 2.7456, 'lng': 101.7099, 'code': 'KUL'},
    '曼谷素万那普国际': {'lat': 13.6900, 'lng': 100.7501, 'code': 'BKK'},
    '金边国际': {'lat': 11.5466, 'lng': 104.8442, 'code': 'PNH'},
    # South Asia
    '德里英迪拉甘地': {'lat': 28.5562, 'lng': 77.1000, 'code': 'DEL'},
    '孟买贾特拉帕蒂希瓦吉': {'lat': 19.0896, 'lng': 72.8656, 'code': 'BOM'},
    '班加罗尔': {'lat': 13.1986, 'lng': 77.7066, 'code': 'BLR'},
    '金奈国际': {'lat': 12.9941, 'lng': 80.1709, 'code': 'MAA'},
    '科伦坡班达拉奈克国际': {'lat': 7.1808, 'lng': 79.8841, 'code': 'CMB'},
    # Middle East
    '多哈哈马德国际': {'lat': 25.2732, 'lng': 51.6081, 'code': 'DOH'},
    '利雅得': {'lat': 24.9576, 'lng': 46.6988, 'code': 'RUH'},
    '安曼阿莉娅王后': {'lat': 31.7226, 'lng': 35.9932, 'code': 'AMM'},
    '特拉维夫本古里安': {'lat': 32.0055, 'lng': 34.8854, 'code': 'TLV'},
    # Europe
    '伦敦希思罗': {'lat': 51.4700, 'lng': -0.4543, 'code': 'LHR'},
    '巴黎戴高乐': {'lat': 49.0097, 'lng': 2.5479, 'code': 'CDG'},
    '法兰克福': {'lat': 50.0379, 'lng': 8.5622, 'code': 'FRA'},
    '慕尼黑': {'lat': 48.3538, 'lng': 11.7861, 'code': 'MUC'},
    '苏黎世': {'lat': 47.4647, 'lng': 8.5492, 'code': 'ZRH'},
    '罗马菲乌米奇诺': {'lat': 41.8003, 'lng': 12.2389, 'code': 'FCO'},
    '阿姆斯特丹史基浦': {'lat': 52.3105, 'lng': 4.7683, 'code': 'AMS'},
    '巴塞罗那埃尔普拉特': {'lat': 41.2971, 'lng': 2.0785, 'code': 'BCN'},
    '马德里巴拉哈斯': {'lat': 40.4936, 'lng': -3.5668, 'code': 'MAD'},
    '格拉纳达': {'lat': 37.1881, 'lng': -3.7771, 'code': 'GRX'},
    '曼彻斯特': {'lat': 53.3537, 'lng': -2.2750, 'code': 'MAN'},
    # North America
    '旧金山国际': {'lat': 37.6213, 'lng': -122.3790, 'code': 'SFO'},
    '洛杉矶国际': {'lat': 33.9425, 'lng': -118.4081, 'code': 'LAX'},
    '诺曼峰田圣何塞': {'lat': 37.3639, 'lng': -121.9289, 'code': 'SJC'},
    '西雅图塔克马国际': {'lat': 47.4502, 'lng': -122.3088, 'code': 'SEA'},
    '芝加哥奥黑尔': {'lat': 41.9742, 'lng': -87.9073, 'code': 'ORD'},
    '纽约肯尼迪国际': {'lat': 40.6413, 'lng': -73.7781, 'code': 'JFK'},
    '纽约纽瓦克国际': {'lat': 40.6895, 'lng': -74.1745, 'code': 'EWR'},
    '休斯敦乔治布什洲际': {'lat': 29.9902, 'lng': -95.3368, 'code': 'IAH'},
    '休斯敦霍比': {'lat': 29.6454, 'lng': -95.2789, 'code': 'HOU'},
    '达拉斯沃思堡国际': {'lat': 32.8998, 'lng': -97.0403, 'code': 'DFW'},
    '爱田': {'lat': 32.8481, 'lng': -96.8512, 'code': 'DAL'},
    '多伦多皮尔逊': {'lat': 43.6777, 'lng': -79.6248, 'code': 'YYZ'},
    '明尼阿波利斯圣保罗': {'lat': 44.8848, 'lng': -93.2223, 'code': 'MSP'},
    '哈里里德国际': {'lat': 36.0840, 'lng': -115.1537, 'code': 'LAS'},
    '圣地亚哥国际': {'lat': 32.7338, 'lng': -117.1933, 'code': 'SAN'},
    '奥克兰都会': {'lat': 37.7213, 'lng': -122.2208, 'code': 'OAK'},
    '伯明翰沙特尔斯沃思国际': {'lat': 33.5629, 'lng': -86.7535, 'code': 'BHM'},
    # Australia
    '悉尼金斯福德': {'lat': -33.9461, 'lng': 151.1772, 'code': 'SYD'},
    '墨尔本': {'lat': -37.6690, 'lng': 144.8410, 'code': 'MEL'},
    '阿德莱德': {'lat': -34.9461, 'lng': 138.5311, 'code': 'ADL'},
    '珀斯': {'lat': -31.9403, 'lng': 115.9672, 'code': 'PER'},
}


def main():
    # Build lookups
    CODE_TO_COORDS = {v['code']: {'lat': v['lat'], 'lng': v['lng']}
                      for v in AIRPORT_COORDS.values()}
    NAME_TO_CODE = {k: v['code'] for k, v in AIRPORT_COORDS.items()}

    # Initialize timezone finder
    print("Initializing timezone finder...")
    tf = TimezoneFinder()

    # Get timezone for each airport code
    print("Looking up timezones for all airports...")
    airport_timezones = {}
    for code, coords in CODE_TO_COORDS.items():
        tz_name = tf.timezone_at(lat=coords['lat'], lng=coords['lng'])
        if tz_name:
            airport_timezones[code] = tz_name
        else:
            print(f"  WARNING: No timezone found for {code}")

    print(f"Found {len(airport_timezones)} airport timezones\n")

    # Read CSV
    input_file = 'itinierary.csv'
    output_file = input_file

    with open(input_file, 'r', encoding='utf-8') as fin:
        reader = csv.DictReader(fin)
        rows = list(reader)

    print(f"Processing {len(rows)} flights...\n")

    # Calculate durations
    for i, row in enumerate(rows, 1):
        dep_name = row['departure_airport']
        arr_name = row['arrival_city']

        dep_code = NAME_TO_CODE.get(dep_name)
        arr_code = NAME_TO_CODE.get(arr_name)

        if not dep_code or not arr_code:
            row['flight_duration'] = 'N/A'
            row['flight_duration_hours'] = ''
            row['flight_duration_minutes'] = ''
            print(f"[{i:3d}] {row['flight_no']:8s} SKIP (missing airport mapping)")
            continue

        if dep_code not in airport_timezones or arr_code not in airport_timezones:
            row['flight_duration'] = 'N/A'
            row['flight_duration_hours'] = ''
            row['flight_duration_minutes'] = ''
            print(f"[{i:3d}] {row['flight_no']:8s} SKIP (missing timezone)")
            continue

        # Calculate duration
        duration_text, duration_hours, duration_minutes = calculate_duration(
            row['date'],
            row['departure_time'],
            dep_code,
            row['arrival_time'],
            arr_code,
            airport_timezones
        )

        row['flight_duration'] = duration_text
        row['flight_duration_hours'] = duration_hours
        row['flight_duration_minutes'] = duration_minutes
        print(
            f"[{i:3d}] {row['flight_no']:8s} {dep_code}→{arr_code:3s}  "
            f"{duration_text:>20s}  ({row['date']} {row['departure_time']} → {row['arrival_time']})"
        )

    # Write output
    with open(output_file, 'w', encoding='utf-8', newline='') as fout:
        fieldnames = list(rows[0].keys())
        writer = csv.DictWriter(fout, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\n✓ Done! Updated {output_file} in place")
    print("  Added/updated columns: 'flight_duration', 'flight_duration_hours', 'flight_duration_minutes'.")


def calculate_duration(dep_date, dep_time, dep_code, arr_time, arr_code, airport_timezones):
    """
    Calculate flight duration accounting for timezones and date rollover.

    Args:
        dep_date: Departure date string (e.g., "2026/4/9")
        dep_time: Departure time string (e.g., "16:35")
        dep_code: Departure airport IATA code
        arr_time: Arrival time string (e.g., "19:45")
        arr_code: Arrival airport IATA code
        airport_timezones: Dict mapping IATA codes to IANA timezone names

    Returns:
        Tuple: (duration_text, hours, minutes)
        Example: ("3 hr 25 min", 3, 25)
    """
    try:
        dep_tz = ZoneInfo(airport_timezones[dep_code])
        arr_tz = ZoneInfo(airport_timezones[arr_code])

        # Parse departure datetime in local timezone
        dep_dt_str = f"{dep_date} {dep_time}"
        dep_dt_naive = datetime.strptime(dep_dt_str, "%Y/%m/%d %H:%M")
        dep_dt = dep_dt_naive.replace(tzinfo=dep_tz)

        # Try same day, +1 day, +2 days for arrival
        dep_date_obj = datetime.strptime(dep_date, "%Y/%m/%d").date()

        for offset in [0, 1, 2]:
            arr_date = dep_date_obj + timedelta(days=offset)
            arr_dt_str = f"{arr_date.strftime('%Y/%m/%d')} {arr_time}"
            arr_dt_naive = datetime.strptime(arr_dt_str, "%Y/%m/%d %H:%M")
            arr_dt = arr_dt_naive.replace(tzinfo=arr_tz)

            duration = arr_dt - dep_dt

            # Sanity check: 10 min < duration < 24 hours
            if timedelta(minutes=10) < duration < timedelta(hours=24):
                total_minutes = int(round(duration.total_seconds() / 60))
                hours = total_minutes // 60
                minutes = total_minutes % 60
                duration_text = f"{hours} hr {minutes:02d} min"
                return duration_text, hours, minutes

        return "ERROR", '', ''

    except Exception as e:
        return f"ERROR({str(e)[:20]})", '', ''


if __name__ == '__main__':
    main()
