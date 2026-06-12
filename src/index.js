const { loadConfig } = require("./config");
const sfmc = require("sfmc");
const { loadState, saveState } = require("./stateStore");
const { forwardPosition } = require("./positionForwarder");

async function handleConnectionEvent(gliderName, events) {
    for (const event of events) {
        console.log(`${gliderName} connection event:`);
        console.log(JSON.stringify(event, null, 2));

        if (event.active === true) {
            console.log(`${gliderName} connected; checking position shortly...`);

            setTimeout(() => {
                checkAndHandlePosition(gliderName, "connect", event);
            }, 10000);

            continue;
        }

        if (event.active === false || event.endDateTime !== null) {
            console.log(`${gliderName} disconnected; checking final position...`);

            await checkAndHandlePosition(gliderName, "disconnect", event);
        }
    }
}


async function checkAndHandlePosition(gliderName, reason, connectionEvent) {
    try {
        const auth = await sfmc.accessToken.getAccessToken();

        const result =
            await sfmc.glider.getActiveGliderDeploymentDetails(
                auth.token,
                gliderName
            );

        const d = result.data;

        const position = {
            gliderName,
            reason,
            connectionId: connectionEvent?.id ?? null,
            gliderDeploymentId: connectionEvent?.gliderDeploymentId ?? d.id ?? null,
            connectionStartDateTime: connectionEvent?.startDateTime ?? null,
            connectionEndDateTime: connectionEvent?.endDateTime ?? null,
            logFilePath: connectionEvent?.logFilePath ?? null,

            gpsDateTime: d.gpsDateTime,
            latitude: slocumCoordToDecimal(d.gpsLat),
            longitude: slocumCoordToDecimal(d.gpsLon),
            nextWaypointLatitude: slocumCoordToDecimal(d.nextWaypointLat),
            nextWaypointLongitude: slocumCoordToDecimal(d.nextWaypointLon),
            isGpsValid: d.isGpsValid
        };

        if (!position.isGpsValid || !position.gpsDateTime) {
            console.log(`No valid GPS position for ${gliderName}; skipping.`);
            console.log(JSON.stringify(position, null, 2));
            return;
        }

        const state = loadState();
        const lastSentGpsDateTime =
            state[gliderName]?.lastSentGpsDateTime;

        if (
            lastSentGpsDateTime &&
            position.gpsDateTime <= lastSentGpsDateTime
        ) {
            console.log(
                `Position for ${gliderName} is not newer than last sent; skipping.`
            );
            console.log(
                `Current: ${position.gpsDateTime}, last sent: ${lastSentGpsDateTime}`
            );
            return;
        }

        console.log("SENDABLE POSITION:");
        console.log(JSON.stringify(position, null, 2));

	await forwardPosition(position, config);	

        // Only update state after successful external send.
        state[gliderName] = {
            lastSentGpsDateTime: position.gpsDateTime,
            lastLatitude: position.latitude,
            lastLongitude: position.longitude,
            lastSentAt: new Date().toISOString()
        };

        saveState(state);

        console.log(`Updated state for ${gliderName}.`);

    } catch (err) {
        console.error(`Failed to check position for ${gliderName} (${reason}):`);
        console.error(err);
    }
}

function slocumCoordToDecimal(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return null;
    }

    const numeric = Number(value);
    const degrees = Math.floor(numeric / 100);
    const minutes = numeric - degrees * 100;

    return degrees + minutes / 60;
}

async function main() {
    const config = loadConfig();

    const auth = await sfmc.accessToken.getAccessToken();
    const stompClient = await sfmc.stompConnect.connect(auth.token);

    for (const gliderName of config.sfmc.gliders) {
        const gliderDetails = await sfmc.glider.getGliderDetails(
            auth.token,
            gliderName
        );

        const gliderId = gliderDetails.data.id;

        console.log(`Subscribing to ${gliderName} (${gliderId})`);

        sfmc.glider.subscribeForConnectionEvents(
            stompClient,
            gliderId,
            (events) => handleConnectionEvent(gliderName, events)
        );
    }

    console.log("Listening for configured gliders...");
}

main().catch((err) => {
    console.error("Listener failed:");
    console.error(err);
});
