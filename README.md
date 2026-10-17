# AeroFlow Intelligence Traffic System ✈️🇮🇳

An interactive data visualization dashboard exploring **1,423 Indian domestic flight routes**, **110 airport hubs**, **14 airlines**, and **10,683 fare records** using real-world aviation datasets.

Built with **React**, **TypeScript**, **Deck.gl (WebGL)**, and **Mapbox GL JS** for the Data Visualization Project (DVP).

---

## 📌 Why We Built This

India has one of the fastest-growing domestic aviation markets in the world, yet public flight data is often locked behind booking portals or presented as dry tables. We wanted to build a visual, hands-on tool that answers practical questions:

- Which airports act as the true transit backbones of India?
- How do ticket prices vary across airlines (budget LCCs vs. full-service carriers) on the exact same route?
- Why do some corridors have 5+ competing airlines with frequent flights, while remote regions rely on a single carrier?
- Does distance alone determine flight cost, or does competition play a bigger role?

---

## ✨ Features

### 1. 🌐 Interactive 3D Flight Network Map
- **Hardware-accelerated Deck.gl WebGL rendering**: Displays 1,423 great-circle flight arcs across 110 Indian airports at a steady 60 FPS.
- **Dynamic perspective**: Switch between 3D tilted view and 2D planar map.
- **Interactive picking**: Hover or click any route arc or airport dot to inspect live frequency, primary airline, and fare ranges.
- **Layer filters**: Toggle route arcs and airport nodes on/off with custom color-coded airline identities.

### 2. 🔍 Corridor Fare Analyzer & Flight Comparison
- **Search any corridor**: Select any origin and destination airport across India with a 1-click swap button.
- **Flight & airline comparison**: View all airlines operating on that specific corridor (e.g., IndiGo, SpiceJet, Air India, Vistara) along with their individual average, promo, and peak ticket prices.
- **Value badges**: Instantly spots the **Lowest Price** carrier and identifies **Full-Service** options (meals & baggage included).
- **Side-by-side corridor comparison**: Compare two different routes side-by-side (e.g., *Delhi → Mumbai* vs. *Delhi → Bengaluru*) to see differences in distance, average fare, departures, and price-per-kilometer yield.

### 3. 📡 Airport Directory & Hub Classification
- Complete directory of **110 active Indian airports** with verified coordinates, elevations, and ICAO/IATA codes from OurAirports.
- Automatic hub tiering:
  - **Primary Hubs** (≥30 destinations): Delhi (DEL), Mumbai (BOM), Bengaluru (BLR), Hyderabad (HYD), Kolkata (CCU), Chennai (MAA).
  - **Major Airports** (10–29 destinations): Ahmedabad, Goa, Pune, Kochi, Guwahati, Jaipur, etc.
  - **Regional Connectors** (<10 destinations): Remote and Tier-2/3 connectivity.
- Click any airport to view its full outbound flight schedule and destination list.

### 4. 💰 Fare Variation & Price Matrix
- Synthesizes **10,683 pricing records** from the Indian flight price dataset.
- Interactive histogram showing the price distribution across budget, median, and peak premium tiers.
- Carrier-level price comparison chart and a sortable empirical price matrix table.

### 5. 🏢 Airline Operations & Market Reach
- Profiles **14 scheduled Indian carriers** (IndiGo, Air India, SpiceJet, Vistara, Akasa Air, Alliance Air, Star Air, etc.).
- Evaluates total weekly departures, network coverage (unique routes operated), and flight capacity share.
- Deep-dive card for each carrier showing their top 5 busiest routes and operational focus.

### 6. 🔀 Route Competition & Market Contestability
- Categorizes all 1,423 domestic routes into three economic tiers:
  - **Monopoly (1 Carrier)**: ~65% of routes (mostly regional/UDAN connectivity).
  - **Contestable (2–3 Carriers)**: ~27% of routes (duopolies and emerging city pairs).
  - **Hyper-Competitive (4+ Carriers)**: ~8% of routes (high-density metro trunk routes with intense price competition).

### 7. 🎨 Warm Cream & Night Radar Themes
- Designed with a clean, human-centered **Warm Cream** daylight theme for reading and report presentations.
- Includes a 1-click toggle to a dark **Night Radar** theme for low-light visualization.

---

## 📊 Datasets Used

This project does not use artificial dummy data. All metrics are derived from three verified datasets:

1. **Indian Domestic Timetable Dataset** (`33,734` records): Real schedule records mapping airline flight numbers, origins, destinations, and weekly departure frequencies across India.
2. **Indian Flight Price Dataset** (`10,683` records): Observed commercial ticket prices across 12 carrier types and major domestic corridors.
3. **OurAirports India Dataset** (`110` aerodromes): Exact latitude, longitude, elevation, airport type, and IATA/ICAO codes.

> Full data preprocessing pipeline and Exploratory Data Analysis (EDA) are documented in [`notebooks/aeroflow_data_preprocessing_and_eda.ipynb`](notebooks/aeroflow_data_preprocessing_and_eda.ipynb).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Geospatial & 3D Mapping**: Deck.gl 9.x (`ArcLayer`, `ScatterplotLayer`), Mapbox GL JS 3.x
- **Charts**: Recharts 2.x
- **Icons**: Lucide React
- **Data Engineering**: Python 3, Pandas, Jupyter Notebook

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and `npm` installed.

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/Aeroflow-Intelligence-Traffic-System.git
   cd Aeroflow-Intelligence-Traffic-System
   ```

2. **Navigate to the frontend folder and install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Mapbox Token (Optional)
The application includes a clean dark/cream cartographic fallback so it runs immediately without configuration. If you wish to use your own custom Mapbox vector tiles:
1. Create a free account at [mapbox.com](https://www.mapbox.com/).
2. Copy your public token.
3. Create a `.env` file in the `frontend/` folder:
   ```env
   VITE_MAPBOX_TOKEN=your_mapbox_public_token_here
   ```

---

## 📁 Project Structure

```
Aeroflow-Intelligence-Traffic-System/
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI cards, headers, filters, comparator
│   │   │   ├── CorridorFareComparator.tsx  # Dynamic corridor & flight comparison tool
│   │   │   ├── Header.tsx                  # Sticky brand header & theme switcher
│   │   │   ├── Sidebar.tsx                 # Navigation sidebar
│   │   │   ├── KpiCards.tsx                # Dynamic KPI metrics
│   │   │   └── MapTooltip.tsx              # Deck.gl interactive hover tooltip
│   │   ├── pages/              # Main dashboard views
│   │   │   ├── OverviewPage.tsx            # Executive summary & quick route map
│   │   │   ├── MapPage.tsx                 # Fullscreen 3D routes & corridor inspector
│   │   │   ├── AirportAnalysisPage.tsx     # 110 airport directory & hub inspector
│   │   │   ├── FareAnalysisPage.tsx        # Corridor fare search & pricing matrix
│   │   │   ├── AirlineAnalysisPage.tsx     # 14 carrier profiles & market share
│   │   │   ├── CompetitionPage.tsx         # Monopoly vs trunk contestability
│   │   │   └── AboutPage.tsx               # Academic methodology & audit
│   │   ├── maps/               # Deck.gl WebGL + Mapbox canvas
│   │   ├── charts/             # Recharts visual analytics
│   │   ├── context/            # AviationContext (reactive state & filters)
│   │   ├── data/               # Cleaned JSON datasets
│   │   └── types/              # Strict TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── notebooks/                  # Jupyter notebooks for data preprocessing & EDA
│   └── aeroflow_data_preprocessing_and_eda.ipynb
├── .gitignore
└── README.md
```

---

## 💡 Key Findings from the Data

- **The Golden Triangle of Indian Aviation**: Delhi (DEL), Mumbai (BOM), and Bengaluru (BLR) form the densest domestic corridors, each clocking over 90 scheduled flights per week with 5–6 competing carriers.
- **The Monopoly Reality**: Over **65%** of domestic corridors have only 1 airline operating them. These are predominantly regional routes under the government's UDAN scheme connecting Tier-2/3 cities.
- **Yield and Distance Efficiency**: Average price per kilometer drops significantly as stage length increases—from ~₹5.50/km on short hops (<500 km) down to ~₹4.10/km on long-distance routes (>1,500 km), reflecting aircraft cruise fuel efficiency.
- **Low-Cost vs. Full-Service Spread**: On major trunk routes, budget carriers (SpiceJet, IndiGo, Akasa) price economy seats 20% to 35% lower than full-service carriers (Air India, Vistara), which bundle baggage and meals.

---

## 📄 Academic Project Note
This project was developed for the **Data Visualization Project (DVP)** course. It is intended for educational, research and analytical portfolio purposes.
