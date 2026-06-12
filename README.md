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

Planned integrations include BarentsWatch (barentswatch.no), Narval (narval.nersc.no), and other marine data systems.

---

## Prerequisites

This project depends on the proprietary SFMC Node.js SDK, which is distributed as part of a licensed SFMC installation.

Obtain the SDK package:

```text
sfmc.tgz
```

Typically found within an SFMC installation:

```text
/opt/sfmc-toolbox/sfmc-nodejs-rest-lib/sfmc.tgz
```

Install the SDK:

```bash
npm install /path/to/sfmc.tgz
```

Example:

```bash
npm install ~/vendor/sfmc.tgz
```

Requirements:

* Node.js 20+
* Access to an SFMC installation
* SFMC Node.js SDK (`sfmc.tgz`)

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
* Persistent state tracking
* External forwarding framework

### In Progress

* BarentsWatch integration
* Narval integration
* Service hardening and reconnect logic
* Structured logging
* Systemd deployment

---

## Architecture

```text
SFMC
  │
  ├─ Connection Event
  │
  ▼
index.js
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
          ├─ Narval
          └─ Future APIs

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
    index.js
    config.js
    stateStore.js
    positionForwarder.js
    barentswatchClient.js
    narvalClient.js

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
            "durin",
            "dvalin",
            "urd"
        ]
    },

    "barentswatch": {
        "enabled": false
    },

    "narval": {
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

Install the SFMC SDK:

```bash
npm install /path/to/sfmc.tgz
```

---

## Running

Run interactively:

```bash
node src/index.js
```

Run in background:

```bash
nohup node src/index.js \
    > logs/index.log 2>&1 &
```

View logs:

```bash
tail -f logs/index.log
```

Stop service:

```bash
pkill -f "src/index.js"
```

---

## Position Processing

When a glider connects:

1. Receive SFMC connection event
2. Query active deployment
3. Extract latest GPS fix
4. Convert Slocum coordinates to decimal degrees
5. Compare against previously forwarded positions
6. Forward if position is new
7. Update local state

Duplicate positions are suppressed using:

```text
state/last_positions.json
```

This allows safe restarts without retransmitting previously forwarded positions.

---

## Future Work

* BarentsWatch integration
* Narval integration
* Additional destination APIs
* Automatic reconnect handling
* Structured logging
* Systemd deployment
* Deployment metadata support
* Health monitoring and alerting

---

## Author

Fiona Elliott

University of Bergen
