import json
import time
import random
import os
import paho.mqtt.client as mqtt
from datetime import datetime

# Configuration
MQTT_HOST = os.getenv("MQTT_HOST", "localhost")
MQTT_PORT = 1883

client = mqtt.Client()

def connect_mqtt():
    while True:
        try:
            client.connect(MQTT_HOST, MQTT_PORT, 60)
            print(f"Connected to MQTT Broker at {MQTT_HOST}")
            break
        except:
            print("Failed to connect to MQTT, retrying in 5s...")
            time.sleep(5)

def publish_to_uns(topic, value, unit=None):
    payload = {
        "value": value,
        "unit": unit,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "status": "ONLINE"
    }
    client.publish(topic, json.dumps(payload))

def simulate_factory():
    connect_mqtt()
    
    machines = ["Machine1", "Machine2", "Machine3"]
    lines = ["Line1"]
    
    print("Industry 5.0 Edge Node Simulation Started...")
    
    while True:
        for line in lines:
            for machine in machines:
                # 1. Base Telemetry
                temp = 25 + random.uniform(0, 10)
                vibration = 0.5 + random.uniform(0, 0.2)
                energy = 1.2 + random.uniform(0, 0.5)
                
                # 2. Edge AI Logic (Industry 5.0)
                # Local anomaly detection
                if machine == "Machine3" and random.random() > 0.95:
                    vibration += 5.0 # Spike
                    print(f"!!! EDGE AI ALERT: Abnormal vibration detected on {machine} !!!")
                    publish_to_uns(f"Factory/{line}/{machine}/Alert", "HIGH_VIBRATION", "CRITICAL")
                
                # 3. UNS Publishing
                publish_to_uns(f"Factory/{line}/{machine}/Temperature", round(temp, 2), "C")
                publish_to_uns(f"Factory/{line}/{machine}/Vibration", round(vibration, 2), "mm/s")
                publish_to_uns(f"Factory/{line}/{machine}/Energy", round(energy, 2), "kWh")
                
                # 4. Sustainability KPI
                carbon_footprint = energy * 0.45 # Simulation factor
                publish_to_uns(f"Factory/{line}/{machine}/CO2", round(carbon_footprint, 3), "kg")
                
                # 5. Production Metrics (OEE)
                oee = 85 + random.uniform(-5, 5)
                publish_to_uns(f"Factory/{line}/{machine}/OEE", round(oee, 1), "%")

        time.sleep(2)

if __name__ == "__main__":
    simulate_factory()
