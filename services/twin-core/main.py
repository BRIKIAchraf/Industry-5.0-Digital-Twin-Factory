import json
import logging
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import paho.mqtt.client as mqtt
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
from pydantic import BaseModel
from typing import Dict, Any, List

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("DigitalTwinCore")

app = FastAPI(title="Digital Twin Core - Industry 5.0")

# CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MQTT_HOST = os.getenv("MQTT_HOST", "localhost")
MQTT_PORT = 1883
INFLUXDB_URL = os.getenv("INFLUXDB_URL", "http://localhost:8086")
INFLUXDB_TOKEN = os.getenv("INFLUXDB_TOKEN", "factory_token_2026")
INFLUXDB_ORG = "digital_twin_factory"
INFLUXDB_BUCKET = "telemetry"

# In-memory UNS state
unified_namespace: Dict[str, Any] = {}

# MQTT Setup
mqtt_client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    logger.info(f"Connected to MQTT Broker with result code {rc}")
    # Subscribe to the Unified Namespace root
    client.subscribe("Factory/#")
    logger.info("Subscribed to Factory/# (UNS)")

def on_message(client, userdata, msg):
    try:
        topic = msg.topic
        payload = json.loads(msg.payload.decode())
        
        # Update UNS State
        unified_namespace[topic] = {
            "value": payload.get("value"),
            "timestamp": payload.get("timestamp"),
            "unit": payload.get("unit"),
            "status": payload.get("status", "ONLINE")
        }
        
        # Simplified Sparkplug B handling
        # In a real Sparkplug B app, we'd use Protobuf and handle BIRTH/DEATH certificates
        
        # Save to InfluxDB
        save_to_influx(topic, payload)
        
    except Exception as e:
        logger.error(f"Error processing message: {e}")

mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

def save_to_influx(topic, data):
    try:
        with InfluxDBClient(url=INFLUXDB_URL, token=INFLUXDB_TOKEN, org=INFLUXDB_ORG) as client:
            write_api = client.write_api(write_options=SYNCHRONOUS)
            
            # Parse topic: Factory/Line1/Machine3/Temperature
            parts = topic.split('/')
            if len(parts) >= 4:
                line = parts[1]
                machine = parts[2]
                tag = parts[3]
                
                point = Point("telemetry") \
                    .tag("line", line) \
                    .tag("machine", machine) \
                    .field(tag, float(data.get("value", 0))) \
                    .time(data.get("timestamp"), WritePrecision.NS)
                
                write_api.write(bucket=INFLUXDB_BUCKET, org=INFLUXDB_ORG, record=point)
    except Exception as e:
        logger.error(f"InfluxDB Write Error: {e}")

# Start MQTT in background
@app.on_event("startup")
async def startup_event():
    mqtt_client.connect(MQTT_HOST, MQTT_PORT, 60)
    mqtt_client.loop_start()

# API Endpoints
class Query(BaseModel):
    question: str

@app.get("/uns")
async def get_uns():
    """Returns the current state of the Unified Namespace"""
    return unified_namespace

@app.post("/ai/copilot")
async def ai_copilot(query: Query):
    """Industry 5.0 AI Assistant with Mock RAG over UNS"""
    question = query.question.lower()
    
    # Analyze UNS for context
    critical_machines = [topic for topic, data in unified_namespace.items() if data.get("status") == "CRITICAL" or (isinstance(data.get("value"), (int, float)) and data.get("value") > 90 and "OEE" not in topic)]
    
    avg_oee = 0
    oee_values = [data.get("value") for topic, data in unified_namespace.items() if "OEE" in topic]
    if oee_values:
        avg_oee = sum(oee_values) / len(oee_values)

    # Intelligent Mock Response
    if "oee" in question:
        return {
            "answer": f"The current factory OEE is {avg_oee:.1f}%. Line 1 is performing well, but I notice some instability in Machine 3's throughput.",
            "actions": ["View OEE Trends", "Optimize Line 1"]
        }
    
    if "vibration" in question or "machine 3" in question:
        m3_vib = unified_namespace.get("Factory/Line1/Machine3/Vibration", {}).get("value", 0)
        status = "NORMAL" if m3_vib < 2 else "WARNING"
        return {
            "answer": f"Machine 3 vibration is currently {m3_vib} mm/s ({status}). My predictive model suggests a 15% increase in failure risk if we maintain current speeds. Should I suggest a setpoint adjustment?",
            "actions": ["Check Bearings", "Reduce Speed", "Schedule Maintenance"]
        }

    if "energy" in question or "sustainability" in question:
        total_energy = sum([data.get("value", 0) for topic, data in unified_namespace.items() if "Energy" in topic])
        return {
            "answer": f"Total energy consumption is {total_energy:.2f} kWh. We are currently 5% above our sustainability target for this shift. I recommend dimming non-essential lighting in Area 4.",
            "actions": ["Energy Report", "Optimize HVAC"]
        }

    return {
        "answer": "I'm monitoring the Unified Namespace. I can help with OEE analysis, predictive maintenance alerts, or sustainability tracking. What would you like to know?",
        "actions": ["Show Status Overview", "Analyze Energy"]
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "mode": "Industry 5.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
