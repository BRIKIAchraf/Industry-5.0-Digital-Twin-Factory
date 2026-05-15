# 🏭 Industry 5.0 Digital Twin Factory

Welcome to the **Digital Twin Factory 5.0**, a state-of-the-art Industrial IoT (IIoT) ecosystem designed for the next generation of manufacturing. This project implements a **Unified Namespace (UNS)** architecture, **Edge Intelligence**, and a human-centric **AI Copilot** to bridge the gap between Operational Technology (OT) and Information Technology (IT).

---

## 🌟 Vision: Industry 4.0 ➡️ 5.0

This project moves beyond the pure automation of Industry 4.0 into the three pillars of **Industry 5.0**:
1.  **Human-Centric**: An AI Copilot assists operators instead of replacing them.
2.  **Sustainable**: Real-time tracking of CO2 and Energy consumption.
3.  **Resilient**: Edge-first architecture that functions even when cloud connectivity is lost.

---

## 🚀 Quick Start

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose
- Node.js (for local dashboard development, optional)

### Launching the Factory
Run the following command in the root directory:
```bash
docker-compose up --build
```

### Accessing the System
- **Premium Dashboard**: [http://localhost:5173](http://localhost:5173)
- **Digital Twin API (FastAPI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **InfluxDB Admin**: [http://localhost:8086](http://localhost:8086)
- **Grafana (Analytics)**: [http://localhost:3001](http://localhost:3001)

---

## 🏗️ Core Features

### 1. Unified Namespace (UNS)
A single, centralized source of truth for all factory data. Every sensor, machine, and KPI is mapped to a hierarchical MQTT topic structure:
`Factory/{Line}/{Machine}/{Tag}`

### 2. Edge AI & Resilience
The **Edge Node** performs local anomaly detection. If high vibration is detected, an immediate alert is published to the UNS, ensuring rapid response without cloud latency.

### 3. Industrial AI Copilot
A natural language interface that allows operators to query the factory state.
- *"How is the OEE on Line 1?"*
- *"Explain why Machine 3 has a warning status."*
- *"What is our current carbon footprint?"*

### 4. Sustainability Twin
Integrated monitoring of energy efficiency and carbon emissions, allowing for "Green Production" optimization.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Connectivity** | MQTT (Mosquitto), Sparkplug B (Simplified) |
| **Database** | InfluxDB 2.7 (Time-Series) |
| **Backend** | FastAPI (Python), Pydantic |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **AI/ML** | Mock RAG (Expandable to Ollama/OpenAI) |
| **Infrastructure** | Docker, Docker Compose |

---

## 📂 Project Structure

```text
├── dashboard/               # Premium React UI
├── services/
│   ├── twin-core/           # Digital Twin "Brain" (FastAPI)
│   └── edge-node/           # Physical/Edge Simulation (Python)
├── infrastructure/
│   ├── mosquitto/           # MQTT Broker Configuration
│   ├── influxdb/            # Time-series storage
│   └── grafana/             # Monitoring Dashboards
└── docker-compose.yml       # Orchestration
```

---

## 📘 Documentation
- [Technical Architecture](ARCHITECTURE.md) - Deep dive into the UNS and data flow.
- [Walkthrough Guide](walkthrough.md) - Step-by-step exploration of the features.

---
**Developed for the Future of Manufacturing 2026**
