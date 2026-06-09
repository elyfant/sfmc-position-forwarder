# SFMC Position Forwarder

Listener service for forwarding Slocum glider positions from SFMC to external systems.

## Overview

This project listens for glider connection events from SFMC and retrieves the latest validated GPS position for configured gliders.

When a new position is detected, it is normalised into a common format and can be forwarded to one or more external APIs.

Current development is focused on:

* SFMC event subscriptions
* Position extraction from active deployments
* Position deduplication
* State persistence
* External API integration framework

Planned integrations include BarentsWatch (barentswatch.no) and Narval (narval.nersc.no).

---

## Current Status

### Working

* Authentication with SFMC
* STOMP event subscriptions
* Multi-glider support
* Active deployment polling
* GPS position extraction
* Slocum coordinate conversion
* Position deduplication
* State persistence

### In Progress

* External API forwarding
* BarentsWatch integration
* Service hardening and reconnect logic
* Systemd deployment

---

## Architecture

```text
SFMC
  │
  ├─ Connection Event
  │
  ▼
listenerAndPollGlider.js
  │
  ├─ Query Active Deployment
  ├─ Extract Position
  ├─ Deduplicate
  └─ Forward Position
          │
          ▼
    positionForwarder.js
          │
          ├─ BarentsWatch
          ├─ API 2
          └─ API 3

State
  │
  ▼
state/last_positions.json
```

---

## Project Structure

```text
config/
    app.json

logs/

src/
    listenerAndPollGlider.js
    config.js
    stateStore.js
    positionForwarder.js
    barentswatchClient.js

state/
    last_positions.json

systemd/
```

---

## Configuration

### app.json

```json
{
    "sfmc": {
        "gliders": [
            "glider-1",
            "glider-2",
            "glider-1"
        ]
    },

    "barentswatch": {
        "enabled": false
    },

    "logging": {}
}
```

### local.json

Contains SFMC credentials and access configuration.

This file is not committed to Git.

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Running

Run interactively:

```bash
node src/listenerAndPollGlider.js
```

Run in background:

```bash
nohup node src/listenerAndPollGlider.js \
    > logs/listenerAndPollGlider.log 2>&1 &
```

View logs:

```bash
tail -f logs/listenerAndPollGlider.log
```

Stop service:

```bash
pkill -f "listenerAndPollGlider.js"
```

---

## Position Processing

When a glider connects:

1. Receive SFMC connection event
2. Query active deployment
3. Extract latest GPS fix
4. Convert Slocum coordinates to decimal degrees
5. Compare against last transmitted position
6. Forward if position is new
7. Update local state

---

## Future Work

* BarentsWatch integration
* narval integration
* Multiple destination APIs
* Automatic reconnect handling
* Structured logging
* Systemd service deployment
* Deployment metadata support
* Health monitoring and alerting

---

## Author

Fiona Elliott

University of Bergen
