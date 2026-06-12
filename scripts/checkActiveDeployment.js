const sfmc = require("sfmc");

const gliderName = process.argv[2] || "durin";

async function main() {
    try {

        console.log("Requesting access token...");
        const auth = await sfmc.accessToken.getAccessToken();

        console.log(
            `Calling getActiveGliderDeploymentDetails for ${gliderName}...`
        );

        const result =
            await sfmc.glider.getActiveGliderDeploymentDetails(
                auth.token,
                gliderName
            );

        console.log(
            JSON.stringify(result, null, 2)
        );

    } catch (err) {

        console.error(
            "Failed to get active deployment details:"
        );

        console.error(err);
        process.exitCode = 1;
    }
}

main();
