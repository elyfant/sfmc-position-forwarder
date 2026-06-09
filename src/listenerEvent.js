const sfmc = require("sfmc");
const glider = "durin";

function handleGliderOutput(event) {
    console.log("Connection event received:");
    console.log(JSON.stringify(event, null, 2));
}

async function main() {
    try {
        console.log("Requesting access token...");
        const auth = await sfmc.accessToken.getAccessToken();

        console.log("Getting glider details...");
        const gliderDetails = await sfmc.glider.getGliderDetails(
            auth.token,
            glider
        );

        const gliderId = gliderDetails.data.id;
        console.log(`Resolved ${glider} to glider ID ${gliderId}`);

        console.log("Connecting to SFMC event stream...");
        const stompClient = await sfmc.stompConnect.connect(auth.token);

        console.log("Subscribing to connection events...");
        sfmc.glider.subscribeForGliderOutputEvents(
            stompClient,
            gliderId,
            handleGliderOutput
        );

        console.log("Listening for connection events...");

    } catch (err) {
        console.error("Listener failed:");
        console.error(err);
    }
}

main();
