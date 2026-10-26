# Industry 5.0 Digital Twin Factory

Industrial IoT and digital-twin platform designed to connect factory operations, edge intelligence, AI-assisted decision support, and sustainability metrics.

## Why this project matters

The project explores how a factory can become:

- **Human-centric:** an AI copilot assists operators with context about machines and KPIs;
- **Resilient:** edge processing continues when cloud connectivity is unavailable;
- **Sustainable:** energy consumption and CO₂ indicators are tracked alongside production data.

## Architecture

~~~text
Sensors / machine simulator
          ↓ MQTT / Sparkplug B
      Edge node
          ↓ Unified Namespace
     Digital Twin API
          ↓
 InfluxDB time series + Grafana
          ↓
   React operations dashboard
~~~

## Main capabilities

- Unified Namespace topics using `Factory/{Line}/{Machine}/{Tag}`;
- local anomaly detection at the edge;
- digital-twin state exposed through a FastAPI service;
- time-series storage with InfluxDB;
- operational dashboards with Grafana;
- energy and carbon indicators;
- AI-copilot interaction model for operators;
- Docker Compose environment for local demonstration.

## Technology stack

| Layer | Technologies |
|---|---|
| Connectivity | MQTT, Mosquitto, Sparkplug B concepts |
| Edge | Python, local event processing |
| API | FastAPI, Pydantic |
| Storage | InfluxDB 2.7 |
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Observability | Grafana |
| Runtime | Docker, Docker Compose |

## Quick start

Prerequisites: Docker, Docker Compose and optionally Node.js.

~~~bash
docker compose up --build
~~~

Expected local services:

- Dashboard: http://localhost:5173
- Digital Twin API: http://localhost:8000/docs
- InfluxDB: http://localhost:8086
- Grafana: http://localhost:3001

## Project structure

~~~text
dashboard/             React operations interface
services/twin-core/    Digital Twin FastAPI service
services/edge-node/    Factory and edge simulation
infrastructure/        MQTT, InfluxDB and Grafana configuration
docker-compose.yml     Local orchestration
~~~

## Engineering focus

This project demonstrates event modelling, edge/cloud separation, industrial telemetry, time-series storage, operational visibility, and human-in-the-loop AI. It is a portfolio implementation and should not be considered a certified industrial control system without security, safety and load validation.

## Roadmap

- Add persistent twin state and versioned event contracts;
- add authentication and role-based access to control actions;
- validate anomaly models with labelled historical data;
- add energy baselines and production-efficiency KPIs;
- add integration and resilience tests.

## Author

**Achraf BRIKI** · [LinkedIn](https://www.linkedin.com/in/achrafbriki/) · [Portfolio](https://achrafbriki.com)
