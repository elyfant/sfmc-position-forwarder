const fs = require("fs");
const path = require("path");

function loadConfig() {

    const configPath = path.join(
        __dirname,
        "..",
        "config",
        "app.json"
    );

    if (!fs.existsSync(configPath)) {
        throw new Error(
            `Missing configuration file: ${configPath}`
        );
    }

    const config = JSON.parse(
        fs.readFileSync(configPath, "utf8")
    );

    if (!config.sfmc) {
        throw new Error(
            "Configuration error: missing sfmc section"
        );
    }

    if (!Array.isArray(config.sfmc.gliders)) {
        throw new Error(
            "Configuration error: sfmc.gliders must be an array"
        );
    }

    return config;
}

module.exports = {
    loadConfig
};
