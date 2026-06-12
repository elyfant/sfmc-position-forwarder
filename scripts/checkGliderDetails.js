const sfmc = require("sfmc");

const gliderName = process.argv[2] || "durin";

async function main() {
    try {
        console.log(`Requesting access token...`);
        const auth = await sfmc.accessToken.getAccessToken();

        console.log(`Calling getGliderDetails for ${gliderName}...`);
        const result = await sfmc.glider.getGliderDetails(
            auth.token,
            gliderName
        );

        console.log(JSON.stringify(result, null, 2));

    } catch (err) {
        console.error("Failed to get glider details:");
        console.error(err);
        process.exitCode = 1;
    }
}

main();
