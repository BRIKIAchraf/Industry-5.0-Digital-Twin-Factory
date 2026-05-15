# Industry 5.0 Digital Twin Factory - Final Walkthrough

The project is now fully operational with a premium, high-fidelity experience.

## 🚀 Launching the System
```bash
docker-compose up --build
```

## 💎 Premium Dashboard Features

### 1. The Industrial AI Copilot (Right Sidebar)
This is the "Brain" of your factory. Try these interactions:
- **Analyze OEE**: Ask *"How is our OEE today?"* - The AI will calculate the average from the UNS and suggest optimizations.
- **Predictive Maintenance**: Ask *"Is Machine 3 safe?"* - The AI will check the vibration data and provide a risk assessment.
- **Sustainability Tracking**: Ask *"Are we meeting energy goals?"* - The AI will sum up factory energy and offer saving tips.
- **Interactive Actions**: Click the blue suggested buttons (e.g., *"Reduce Speed"*) to interact with the AI further.

### 2. Live Unified Namespace (UNS) Explorer
In the center-right column, watch the **UNS Explorer**. It shows the raw MQTT topics organized by line and machine. 
- **Green/Red Status**: Indicators show if a machine tag is within safe operating limits.
- **Real-time Updates**: Data pulses every 1.5 seconds, directly from the Edge simulation.

### 3. What-if Simulation Engine (Bottom Right)
Use the slider to test the impact of "Line Speed" on your factory. 
- See how increasing speed improves **OEE** but drastically increases **Energy Consumption**.
- This demonstrates the Industry 5.0 trade-off between productivity and sustainability.

### 4. Machine Health Monitor
Detailed bars for **Temperature**, **Vibration**, and **Lubricant Quality** give you a "Physical Twin" view of your most critical assets.

## 🛠️ Technical Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide, Recharts.
- **Backend**: FastAPI, Paho MQTT, InfluxDB Client.
- **Edge**: Python Simulation with local anomaly detection (Edge AI).
- **Broker**: Mosquitto (MQTT 3.1.1 + WebSockets).
- **Time-Series**: InfluxDB 2.7.

---
**Congratulations! You have built a state-of-the-art Industry 5.0 Digital Twin.**
