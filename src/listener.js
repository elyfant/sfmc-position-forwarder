const { loadConfig } = require("./config");
const sfmc = require("sfmc");

function handleConnectionEvent(gliderName, event) {
    console.log(`Connection event for ${gliderName}:`);
    console.log(JSON.stringify(event, null, 2));
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
            (event) => handleConnectionEvent(gliderName, event)
        );
    }

    console.log("Listening for configured gliders...");
}

main().catch((err) => {
    console.error("Listener failed:");
    console.error(err);
});
